const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

require('dotenv').config();
//connection env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});


router.get('/', (req, res) => {
    res.render('signin', { errorMessage: null });
})

// GET signin page
router.get('/signin', (req, res) => {
    res.render('signin', { errorMessage: null });
});

router.post('/signin', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }

        if (results.length > 0) {
            const user = results[0];          
            bcrypt.compare(password, user.password, (err, result) => {
                // console.log(user.password);
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Error during password validation'
                    });
                }
                if (result) {
                    req.session.user = username;  // Set session user
                    console.log('Session User loging:', req.session.user);
                    res.status(200).json({
                        status: 'success',
                        message: 'Login successful. Redirecting to profile...',
                        redirectUrl: '/home'  
                    });
                } else {
                    console.log('Password ไม่ถูกต้อง');
                    res.json({
                        status: 'error',
                        message: 'Incorrect password. Please try again.'
                    });
                }
            });
        } else {
            console.log('ไม่พบ Email ในระบบ');
            res.json({
                status: 'error',
                message: 'Email not found'
            });
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
    const username = email;
    // Check if user ซ้ำ
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('signup', { errorMessage: 'Username นี้มีชื่อผู้ใช้งานแล้ว' });
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

// GET profile page
router.get('/home', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for user:', req.session.user);
        // ดึงข้อมูลของผู้ใช้จากฐานข้อมูล
        connection.query('SELECT * FROM users WHERE username = ?', [req.session.user], (err, results) => {
            if (err) throw err;
            const user = results[0];
            res.render('home', { user});
        });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});




// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/signin');
});

module.exports = router;
