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
    const { fchk_username, fchk_password } = req.body;
      // valida data
    if (!fchk_username || !fchk_password) {
        return res.status(400).json({
            status: "error",
            message: "กรุณากรอกข้อมูลให้ครบทุกช่อง"
        })
    } else {
        connection.query('select * from employee where email = ?',[fchk_username],(err,results)=>{
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).json({
                    status: 'error',
                    message: 'query เกิดข้อผิดพลาด'
                });
            } else {
                if(results.length > 0){
                    const user =results[0];
                    bcrypt.compare(fchk_password,user.password, (err, isMatch) => {
                        console.log('password เข้ารหัส',user.password);
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                status: 'error',
                                message: 'Error password validation'
                            });        
                        }
                        if (isMatch) {
                            req.session.user = user.firstname +" "+ user.lastname;  // Set session user
                            console.log('Session User loging:', req.session.user);
                            res.status(200).json({
                                data: results,
                                status: 'success',
                                message: 'เข้าสู่ระบบสำเร็จ......',
                                redirectUrl: '/home'
                            });
                            console.log(user.empid)
                            console.log("Check password เป็น false or true  :",isMatch)
                        } else {
                            console.log('Password ไม่ถูกต้อง');
                            res.status(401).json({
                                status: 'error',
                                message: 'Incorrect password. Please try again.'
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
            }
        });
    }
});
 
// GET signup page
router.get('/signup', (req, res) => {
    res.render('signup', { errorMessage: null });
});
// POST signup
router.post('/signup', (req, res) => {
    const { fchk_signup_empid,fchk_signup_email,fchk_signup_password,fchk_signup_confrim_password, fchk_signup_firstname, fchk_signup_lastname, fchk_signup_position ,fchk_signup_department, fchk_signup_startdate,fchk_signup_leavebalance} = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!fchk_signup_empid || !fchk_signup_email || !fchk_signup_password || !fchk_signup_confrim_password || !fchk_signup_firstname || !fchk_signup_lastname || !fchk_signup_position || !fchk_signup_department || !fchk_signup_startdate || !fchk_signup_leavebalance) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
    }
      // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
    if (fchk_signup_password !== fchk_signup_confrim_password) {
        return res.status(200).json({
        status: 'warning',
        message: 'ข้อมูลรหัสผ่านไม่ตรงกัน'
    });
    }
    // Check if user ซ้ำ
    connection.query('SELECT * FROM employee WHERE email = ?', [fchk_signup_email], (err, results) => {
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
                    employeeid : fchk_signup_empid,
                    email: fchk_signup_email,
                    password: hashedPassword,
                    firstname: fchk_signup_firstname,
                    lastname: fchk_signup_lastname,
                    position: fchk_signup_position,
                    department: fchk_signup_department,
                    startdate: fchk_signup_startdate,
                    leavebalance: fchk_signup_leavebalance
                    
                };
                // บันทึกข้อมูลผู้ใช้ลงในฐานข้อมูล
                connection.query('INSERT INTO employee SET ?', newUser, (err) => {
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
                    console.log("ลงทะเบียนสำเร็จ")
                });
            });
        }
    });
});


router.get('/home', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for user:', req.session.user);
       
        res.render('home', { user: req.session.user});
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


router.get('/leave-request-add', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for leave_add:', req.session.user);
        res.render('leave-request-add', { user: req.session.user });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

//submit
router.post('/leave-request', (req, res) => {
    const { fchk_leave_requeste_employeeid,fchk_leave_requeste_firstname, fchk_leave_requeste_lastname,fchk_leave_requeste_type,fchk_leave_reason,fchk_leave_requeste_start_date,fchk_leave_requeste_end_date,fchk_leave_totaldays,fchk_leave_status,fchk_leave_requestdate} = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!fchk_leave_requeste_employeeid || !fchk_leave_requeste_firstname || !fchk_leave_requeste_lastname || !fchk_leave_requeste_start_date || !fchk_leave_requeste_end_date || !fchk_leave_requeste_type || !fchk_leave_totaldays || !fchk_leave_requestdate || !fchk_leave_reason) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
    } else {
        connection.query("insert into leaverequests (employeeid,firstname,lastname,leavetype,reason,startdate,enddate,totaldays,status,requestdate) values(?,?,?,?,?,?,?,?,?,?)",[fchk_leave_requeste_employeeid,fchk_leave_requeste_firstname,
            fchk_leave_requeste_lastname,fchk_leave_requeste_type,fchk_leave_reason,fchk_leave_requeste_start_date,fchk_leave_requeste_end_date,fchk_leave_totaldays,
            fchk_leave_status,fchk_leave_requestdate],(error,results) => {
            if (error){
                console.error('Error inserting leaverequests:', err);
                return res.status(400).json({
                    status: 'error',
                    message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล leaverequest'
                }); 
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'ยื่นแบบฟอร์มลาสำเร็จ',
                    // redirectUrl: '/signin' 
                });
            }
        });
    }
    
    
    

});






// Route for leave request form
// router.get('/leave', (req, res) => {
//     const sql = 'SELECT EmployeeID FROM Employee'; // ดึงข้อมูล EmployeeID จากตาราง Employees
//     connection.query(sql, (err, employee) => {
//         if (err) throw err;
//         res.render('leave_form', { employee });
//     });
// });

// POST request to submit leave request
// router.post('/leave', (req, res) => {
//     const { employeeID, leaveType, startDate, endDate, totalDays, status, requestDate } = req.body;
//     const sql = `INSERT INTO LeaveRequests (EmployeeID, LeaveType, StartDate, EndDate, TotalDays, Status, RequestDate) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
//                  connection.query(sql, [employeeID, leaveType, startDate, endDate, totalDays, status, requestDate], (err, result) => {
//         if (err) throw err;
//         res.redirect('/leave');
//     });
// });

// Route for Approval form
// router.get('/approval', (req, res) => {
//     const sql = 'SELECT LeaveRequestID FROM LeaveRequests'; // ดึงข้อมูล LeaveRequestID จากตาราง LeaveRequests
//     db.query(sql, (err, leaveRequests) => {
//         if (err) throw err;
//         res.render('approval_form', { leaveRequests });
//     });
// });

// POST request to submit approval form data
// router.post('/approval', (req, res) => {
//     const { leaveRequestID, approvedBy, approvalDate, comments } = req.body;
//     const sql = `INSERT INTO ApprovalHistory (LeaveRequestID, ApprovedBy, ApprovalDate, Comments) 
//                  VALUES (?, ?, ?, ?)`;
//     db.query(sql, [leaveRequestID, approvedBy, approvalDate, comments], (err, result) => {
//         if (err) throw err;
//         res.redirect('/approval');
//     });
// });

// router.get('/users/:id', async (req, res) => {
//     const { id } = req.params
//     let sql = "SELECT * FROM users WHERE id = ?"
//    await conn.execute(sql,
//         [id],
//         (err, result) => {
//             if(err) {
//                 res.status(500).json({
//                     message : err.message
//                 })
//                 return
//             }
//             res.status(200).json({
//                 message : "เรียกข้อมูลสำเร็จ",
//                 data : result
//             })
//         })
// })
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

