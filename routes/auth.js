const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const saltRounds = 10

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
    console.log('Connected....');
});

router.get('/', (req, res) => {
    res.render('signin', { errorMessage: null });
})
router.get('/signin', (req, res) => {
    res.render('signin', { errorMessage: null });
});

router.post('/signin', (req, res) => {
    const { username, password } = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
    }
    connection.query('SELECT * FROM employees WHERE email = ?', [username], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({
                status: 'error',
                message: 'เกิดข้อผิดพลาดในการค้นหา'
            });
        }
        if (results.length > 0) {
            const user = results[0];          
            bcrypt.compare(password, user.password, (err, isMatch) => {
                console.log('Password เข้ารหัส',user.password);
                if (isMatch) {
                    req.session.user = username;  // Set session user
                    console.log('Session User loging:', req.session.user);
                    res.status(200).json({
                        status: 'success',
                        message: 'Login successful. Redirecting to profile...',
                        redirectUrl: '/home'
                    });
                    console.log(isMatch)
                } else {
                    console.log('Password ไม่ถูกต้อง');
                    res.status(401).json({
                        status: 'error',
                        message: 'Incorrect password. Please try again.'
                    });
                }
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Error during password validation'
                    });
                }
            });
        } else {
            console.log('ไม่พบ Email ในระบบ');
            res.status(401).json({
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
    const { fchk_signup_empid, fchk_signup_firstname, fchk_signup_lastname, fchk_signup_email, fchk_signup_position , fchk_signup_start_date, fchk_signup_password,fchk_signup_confrim_password,fchk_signup_remaining_leaves} = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!fchk_signup_empid || !fchk_signup_firstname || !fchk_signup_lastname || !fchk_signup_email || !fchk_signup_position || !fchk_signup_start_date || !fchk_signup_start_date || !fchk_signup_password || !fchk_signup_confrim_password || !fchk_signup_remaining_leaves) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
    }
      // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
    if (fchk_signup_password !== fchk_signup_confrim_password) {
        return res.status(200).json({
        status: 'warning',
        message: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน'
    });
    }
    // Check if user ซ้ำ
    connection.query('SELECT * FROM employees WHERE email = ?', [fchk_signup_email], (err, results) => {
        if (err) {
            console.error('Error SELECT email:', err);
            return res.status(500).json({
                status: 'error',
                message: 'เกิดข้อผิดพลาดในการค้นหา'
            });
        }
        if (results.length > 0) {
            console.log(results,'email นี้มีชื่อผู้ใช้งานแล้ว');
            return res.status(200).json({
                status: 'warning',
                message: 'email นี้มีชื่อผู้ใช้งานแล้ว'
            });
        } else {
             // เข้ารหัสรหัสผ่านก่อนบันทึก
            bcrypt.hash(fchk_signup_password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน'
                    });
                }
                console.log(fchk_signup_password,hashedPassword);
                // สร้างข้อมูลผู้ใช้ใหม่
                const newUser = {
                    empid: fchk_signup_empid,
                    firstname: fchk_signup_firstname,
                    lastname: fchk_signup_lastname,
                    email: fchk_signup_email,
                    position: fchk_signup_position,
                    start_date: fchk_signup_start_date,
                    remaining_leaves: fchk_signup_remaining_leaves,
                    password: hashedPassword
                };
                // บันทึกข้อมูลผู้ใช้ลงในฐานข้อมูล
                connection.query('INSERT INTO employees SET ?', newUser, (err) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        return res.status(400).json({
                            status: 'error',
                            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
                        });
                    }
                      // ส่งผลลัพธ์การลงทะเบียนสำเร็จกลับไปยัง frontend
                    res.status(201).json({
                        status: 'success',
                        message: 'ลงทะเบียนสำเร็จ',
                        redirectUrl: '/signin'  // URL ที่จะ redirect หลังจากลงทะเบียนสำเร็จ
                    });
                });
            });
        }
    });
});


router.get('/home', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for user:', req.session.user);
       
        res.render('home', { user: req.session.user });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});


// GET signup page
// router.get('/users', (req, res) => {
//     res.render('users', { errorMessage: null });
// });
router.get('/users', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for user:', req.session.user);
        // ดึงข้อมูลของพนักงานทั้งหมดจากฐานข้อมูล
        connection.query('SELECT * FROM employees', (err, results) => {
            if (err) throw err;
            const employees = results;
            // ส่งข้อมูลพนักงานทั้งหมดไปยัง EJS template
            res.render('users', { user: req.session.user, employees });
        });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

router.get('/leave-request', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for leave_request:', req.session.user);
        res.render('leave-request', { user: req.session.user });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});
router.post('/leave-request', (req, res) => {
    const { fchk_signup_empid, fchk_signup_firstname} = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!fchk_signup_empid || !fchk_signup_firstname || !fchk_signup_lastname || !fchk_signup_email || !fchk_signup_position || !fchk_signup_start_date || !fchk_signup_start_date || !fchk_signup_password || !fchk_signup_confrim_password || !fchk_signup_remaining_leaves) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
    }
});

// Search route
// router.get('/search', (req, res) => {
//     const searchQuery = req.query.query;

//     // SQL to search employees by ID or Name
//     const sql = `SELECT * FROM employees WHERE empid LIKE ? OR email LIKE ?`;
//     const queryValue = `%${searchQuery}%`;

//     connection.query(sql, [queryValue, queryValue], (err, results) => {
//         if (err) {
//             return res.status(500).send('Database query error');
//         }
//         res.render('home', { employees: results });
//     });
// });

// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/signin');
});

module.exports = router;

