const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { phoneNumber, firstName, lastName, email, password, address, img, cars = [] } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { phoneNumber, firstName, lastName, email, password: hashedPassword, address, img };

    console.log('Registering user:', newUser);

    pool.query('INSERT INTO tbl_115_users SET ?', newUser, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error registering user' });
        }
        const userID = result.insertId;

        console.log('User registered with ID:', userID);

        if (cars.length > 0) {
            cars.forEach(car => {
                const newCar = { ...car, userID };
                pool.query('INSERT INTO tbl_115_cars SET ?', newCar, (err) => {
                    if (err) {
                        console.error('Error adding car:', err);
                        return res.status(500).json({ message: 'Error adding car' });
                    }
                });
            });
        }

        const token = jwt.sign({ id: userID }, 'your_secret_key');
        res.header('Authorization', `Bearer ${token}`).json({ token, message: 'Registration successful' });
    });
};

exports.getAllUsers = (req, res) => {
    const sql = 'SELECT * FROM tbl_115_users';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
};

exports.deleteUserById = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tbl_115_users WHERE userID = ?';

    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Error deleting user' });
        }
        res.json({ message: 'User deleted successfully' });
    });
};
