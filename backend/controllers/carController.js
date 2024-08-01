const pool = require('../models/db');

exports.getCars = (req, res) => {
    const userID = req.user.id;
    pool.query('SELECT * FROM tbl_115_cars WHERE userID = ?', [userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching cars' });
        }
        res.json(results);
    });
};

exports.addCar = (req, res) => {
    const userID = req.user.id;
    const { carCompany, model, color, year, image, plate, numberOfReports } = req.body; 
    const newCar = { carCompany, model, color, year, image, plate, numberOfReports, userID };

    pool.query('INSERT INTO tbl_115_cars SET ?', newCar, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error adding car' });
        }
        res.json({ carID: result.insertId, ...newCar });
    });
};

exports.deleteCar = (req, res) => {
    const carID = req.params.id;
    const userID = req.user.id;

    pool.query('DELETE FROM tbl_115_cars WHERE carID = ? AND userID = ?', [carID, userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting car' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ message: 'Car deleted successfully' });
    });
};


exports.findCarByPlate = (req, res) => {
    const plate = req.params.plate;
    pool.query('SELECT * FROM tbl_115_cars WHERE plate = ?', [plate], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching car details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(results[0]);
    });
};

exports.findCarById = (req, res) => {
    const carID = req.params.id;
    pool.query('SELECT * FROM tbl_115_cars WHERE carID = ?', [carID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching car details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(results[0]);
    });
};

exports.countUserCars = (req, res) => {
    const userID = req.user.id;
    const query = `
        SELECT COUNT(*) as carCount
        FROM tbl_115_cars
        WHERE userID = ?
    `;
    pool.query(query, [userID], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        console.log('Count query results:', results); 
        res.json({ carCount: results[0].carCount }); 
    });
};




