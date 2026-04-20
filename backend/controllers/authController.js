const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[0];
        
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ auth: false, accessToken: null, message: 'Invalid Password!' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fapd_super_secret_key_2024', {
            expiresIn: 86400 // 24 hours
        });

        // Also fetch profile id if faculty
        let profileId = null;
        if (user.role === 'faculty') {
            const [profiles] = await db.execute('SELECT id, name FROM faculty_profiles WHERE user_id = ?', [user.id]);
            if (profiles.length > 0) {
                profileId = profiles[0].id;
            }
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            profileId: profileId,
            accessToken: token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Route point just to get current user data
exports.me = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, email, role FROM users WHERE id = ?', [req.userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(users[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
