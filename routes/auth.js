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

// homepage route
router.get('/', (req, res) => {
    res.render('login', { errorMessage: null });
    // return res.send({
    //     error: false,
    //     message: 'Welcome to RESTful CRUD API with NodeJS, Express, MYSQL',
    //     written_by: 'yongyut',
    // })
})

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
                    res.redirect('/profile');  // เปลี่ยนเส้นทาง จาก home ไปเป็น Profile
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

// // GET home page show list-signup all 
// router.get('/home', (req, res) => {
//     if (req.session.user) {
//         const searchQuery = req.query.search || ''; // รับคำค้นหาจาก query string
//         const searchSQL = 'SELECT * FROM users WHERE username LIKE ? OR email LIKE ? OR firstname LIKE ? OR lastname LIKE ?';
//         const searchValue = `%${searchQuery}%`;

//         connection.query(searchSQL, [searchValue, searchValue, searchValue, searchValue], (err, results) => {
//             if (err) throw err;
//             res.render('home', { username: req.session.user, users: results, searchQuery: searchQuery });
//         });
//     } else {
//         res.redirect('/login');
//     }
// });



// GET profile page  เพิ่ม Route เพื่อแสดงข้อมูลผู้ใช้และจัดการการแก้ไขข้อมูล
router.get('/profile', (req, res) => {
    if (req.session.user) {
        // ดึงข้อมูลของผู้ใช้จากฐานข้อมูล
        connection.query('SELECT * FROM users WHERE username = ?', [req.session.user], (err, results) => {
            if (err) throw err;
            const user = results[0];
            res.render('profile', { user, errorMessage: null });
        });
    } else {
        res.redirect('/login');
    }
});

// GET all users page
router.get('/users', (req, res) => {
    if (req.session.user) {
        const currentUser = req.session.user; // Assuming `req.session.user` contains user details

        connection.query('SELECT * FROM users', (err, results) => {
            if (err) throw err;
            res.render('users', { users: results, user: currentUser });
        });
    } else {
        res.redirect('/login');
    }
});



// POST update profile
router.post('/profile/update', (req, res) => {
    const { email, firstname, lastname } = req.body;
    const username = req.session.user;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (!email || !firstname || !lastname) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) throw err;
            const user = results[0];
            res.render('profile', { user, errorMessage: 'Please fill in all fields' });
        });
    } else {
        // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
        connection.query('UPDATE users SET email = ?, firstname = ?, lastname = ? WHERE username = ?', 
        [email, firstname, lastname, username], (err) => {
            if (err) throw err;
            res.redirect('/profile');
        });
    }
});



// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
