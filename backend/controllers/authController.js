const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Attempting to log in user with email: ${email}`);
        
        const rows = await db.query('SELECT * FROM tbl_115_users WHERE email = ?', [email]);
        console.log('Query result:', rows);

        if (rows.length === 0) {
            console.error('Invalid email');
            return res.status(400).json({ message: 'Invalid email' });
        }

        const user = rows[0];
        console.log('User from DB:', user);

        const validPass = await bcrypt.compare(password, user.password);
        console.log('Password valid:', validPass);

        if (!validPass) {
            console.error('Invalid password');
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.userID }, 'your_secret_key', { expiresIn: '1h' });

        res.json({
            token,
            message: 'Login successful',
            user: {
                userID: user.userID,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                img: user.img
            },
        });

    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
