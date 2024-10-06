const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// สร้างการเชื่อมต่อกับฐานข้อมูล
const saltRounds = 10
require('dotenv').config();
//connection env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// เชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// กำหนดเส้นทาง /users สำหรับดึงข้อมูลผู้ใช้
router.get('/', (req, res) => {
    const sql = 'SELECT id, firstname, lastname, profile_image FROM users';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({
                status: 'error',
                message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
            });
        }
        // ส่งข้อมูลผู้ใช้ไปยังไฟล์ EJS ที่ชื่อว่า 'users'
        res.render('users', { users: results });
    });
});

module.exports = router;
