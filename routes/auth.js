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


// GET signin page
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
                        redirectUrl: '/home'  // URL ที่จะ redirect หลังจากลงทะเบียนสำเร็จ
                    });
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
        connection.query('SELECT * FROM employees WHERE email = ?', [req.session.user], (err, results) => {
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

// // API /signup สำหรับบันทึกข้อมูลผู้ใช้ลงในฐานข้อมูล
// app.post('/signup', (req, res) => {
//     const { fchk_signup_empid, fchk_signup_username, fchk_signup_email, fchk_signup_firstname, fchk_signup_lastname } = req.body;

//     // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
//     if (!fchk_signup_empid || !fchk_signup_username || !fchk_signup_email || !fchk_signup_firstname || !fchk_signup_lastname) {
//         return res.status(400).json({
//             status: 'error',
//             message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
//         });
//     }

//     // SQL Query สำหรับเพิ่มข้อมูลลงในฐานข้อมูล
//     const sql = `INSERT INTO users (empid, username, email, firstname, lastname) VALUES (?, ?, ?, ?, ?)`;

//     db.query(sql, [fchk_signup_empid, fchk_signup_username, fchk_signup_email, fchk_signup_firstname, fchk_signup_lastname], (err, result) => {
//         if (err) {
//             console.error('Error inserting user:', err);
//             return res.status(500).json({
//                 status: 'error',
//                 message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
//             });
//         }

//         // ส่งผลลัพธ์การลงทะเบียนสำเร็จกลับไปยัง frontend
//         res.status(201).json({
//             status: 'success',
//             message: 'ลงทะเบียนสำเร็จ',
//             redirectUrl: '/profile'  // URL ที่จะ redirect หลังจากลงทะเบียนสำเร็จ
//         });
//     });
// });

