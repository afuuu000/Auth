const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 🛑 Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields (name, email, password) are required' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creating user...');
        const user = await User.create({ name, email, password: hashedPassword, role });

        console.log('Generating verification token...');
        const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Sending email...');
        const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
        await sendEmail(email, 'Verify Email', `Click the link to verify your email: ${verificationLink}`);

        res.status(201).json({ message: 'User registered. Check your email for verification.' });

    } catch (err) {
        console.error('Error in register function:', err);
        res.status(500).json({ error: 'Error registering user.' });
    }
};


// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    if (!user.isVerified) return res.status(403).json({ error: 'Email not verified.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in.' });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified. You can now login.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } }); // Fetch user data
        if (!user) return res.status(404).json({ error: 'User not found.' });

        res.json(user); // Return user details
    } catch (err) {
        res.status(500).json({ error: 'Error fetching profile.' });
    }
};
