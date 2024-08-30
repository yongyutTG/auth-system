const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'auth_system'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// GET login page
router.get('/login', (req, res) => {
    res.render('login', { errorMessage: null });
});

// POST login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.user = username;
                    res.redirect('/home');
                } else {
                    res.render('login', { errorMessage: 'Invalid password' });
                }
            });
        } else {
            res.render('login', { errorMessage: 'Invalid username' });
        }
    });
});

// GET signup page
router.get('/signup', (req, res) => {
    res.render('signup', { errorMessage: null });
});

// POST signup
router.post('/signup', (req, res) => {
    const { email, firstname, lastname, password, icode } = req.body;
    const username = email; // Use email as username for simplicity

    // Check if user already exists
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('signup', { errorMessage: 'Username already exists' });
        } else {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) throw err;
                const newUser = { username, email, firstname, lastname, password: hashedPassword };
                connection.query('INSERT INTO users SET ?', newUser, (err) => {
                    if (err) throw err;
                    req.session.user = username;
                    res.redirect('/home');
                });
            });
        }
    });
});

// GET home page
router.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { username: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
