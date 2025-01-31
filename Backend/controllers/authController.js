const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
// ✅ Register User & Send Verification Email
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields (name, email, password) are required' });
        }

        // 🔹 Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered. Please login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        // ✅ Generate Verification Token (24h expiration)
        const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

        // ✅ Send Verification Email
        await sendEmail(email, 'Verify Your Email', `
            <h3>Welcome, ${name}!</h3>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>This link will expire in 24 hours.</p>
        `);

        res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
    } catch (err) {
        console.error('Error in register function:', err);
        res.status(500).json({ error: 'Error registering user.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

        if (!user.isVerified) return res.status(403).json({ error: "Email not verified. Please check your inbox." });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: "Error logging in." });
    }
};


exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.isVerified) {
            return res.json({ message: "User already verified.", redirect: "/login" });
        }

        user.isVerified = true;
        await user.save(); // Ensure the database is updated!

        return res.json({ message: "Email verified successfully!", redirect: "/login" });
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(400).json({ error: "Invalid or expired verification token." });
    }
};



// ✅ Fetch User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching profile.' });
    }
};

/**
 * ✅ Delete All Users - Admin Only
 */
exports.deleteAllUsers = async (req, res) => {
    try {
        await User.destroy({ where: {}, truncate: true });
        res.json({ message: "All users have been deleted." });
    } catch (err) {
        res.status(500).json({ error: "Error deleting users." });
    }
};


  
  