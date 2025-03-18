const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

 //กำหนดจำนวนรอบของการ hashing 
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
    // Validate datas
    if (!fchk_username || !fchk_password) {
        console.log('กรุณากรอกข้อมูลให้ครบทุกช่อง');
        return res.status(400).json({
            status: "error",
            message: "กรุณากรอกข้อมูลให้ครบทุกช่อง"
        });
        
    } else {
        connection.query('SELECT * FROM employee WHERE email = ?', [fchk_username], (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).json({
                    status: 'error',
                    message: 'query signin เกิดข้อผิดพลาด'
                });
            } else {
                if (results.length > 0) {
                    const user = results[0]; //เก็บค่าไว้ส่งไป views
                    bcrypt.compare(fchk_password, user.password, (err, isMatch) => {
                        console.log('password เข้ารหัส เรียบร้อยแล้ว', user.password);
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                status: 'error',
                                message: 'Error password เข้ารหัส'
                            });
                        }
                        if (isMatch) {
                            req.session.employeeid = user.employeeid;
                            req.session.user = user.firstname + " " + user.lastname; // Set session user
                            req.session.department = user.department;
                            console.log('Session User signin:', "employeeid: " + req.session.employeeid + " user: " + req.session.user);
                           
                            // ตรวจสอบบทบาท (role) ของผู้ใช้
                            if (user.role === 'admin') {
                                // ถ้าเป็น admin ให้เปลี่ยนเส้นทางไปหน้า admin
                                res.status(200).json({
                                    data: results,
                                    status: 'success',
                                    message: 'เข้าสู่ระบบสำเร็จ',
                                    redirectUrl: '/admin'
                                 });
                            } else {
                                
                                // // ถ้าเป็น user ปกติ ให้เรนเดอร์หน้า home.ejs พร้อมส่งข้อมูลและ status
                                res.status(200).json({
                                    data: results,
                                    user: user,  
                                    status: 'success',
                                    message: 'เข้าสู่ระบบสำเร็จ',
                                    redirectUrl: '/home'
                                });
                        }
                            console.log(`User ${req.session.user} is logged in`);
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
    const { fchk_signup_empid,fchk_signup_email,fchk_signup_password,fchk_signup_confrim_password, fchk_signup_firstname, fchk_signup_lastname, fchk_signup_position ,fchk_signup_department, fchk_signup_startdate,fchk_signup_role,fchk_signup_leavebalance} = req.body;

    if (!fchk_signup_empid || !fchk_signup_email || !fchk_signup_password || !fchk_signup_confrim_password || !fchk_signup_firstname || !fchk_signup_lastname || !fchk_signup_position || !fchk_signup_department || !fchk_signup_startdate || !fchk_signup_role || !fchk_signup_leavebalance) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
    }

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
                    role: fchk_signup_role,
                    leavebalance: fchk_signup_leavebalance
                    
                };
               
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
                        message: 'ลงทะเบียนสำเร็จ.....',
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
        console.log('Rendering หน้า home โดย user:', req.session.user);
        const employeeid = req.session.employeeid; 

        connection.query("SELECT * FROM employee WHERE employeeid = ?",[employeeid],(err, user_detail) => {
                if (err){
                    console.error('Error query user_detail:', err);
                    return res.status(400).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการค้นหาประวัติการลา leave-profile'
                    }); 
                } else {
                    res.render('home', {
                    user_detail: user_detail, 
                    user: req.session.user});
                }
            }
        );
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

//GET signup page
router.get('/users', (req, res) => {
    res.render('users', { errorMessage: null });
});
router.get('/users', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for user:', req.session.user);
        
        connection.query('SELECT * FROM employees', (err, results) => {
            if (err) throw err;
            const employees = results;
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

//สำหรับดึงฟอร์มใบคำขอลา
router.get('/leave-request-form', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for leave-request-form:', req.session.user);
        const employeeid = req.session.employeeid; 

        connection.query("SELECT * FROM employee WHERE employeeid = ?",[employeeid],(err, leave_request_form) => {
                if (err){
                    console.error('Error query leaveHistory:', err);
                    return res.status(400).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการค้นหาประวัติการลา leave-request-form'
                    }); 
                } else {
                    res.render('leave-request-form', {
                    leave_request_form: leave_request_form, // ส่งข้อมูลประวัติการลาไปยัง view
                    user: req.session.user});
                }
            }
        );
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});
//รับค่าจากแบบฟอร์มคำขอลา
router.post('/leave-request', (req, res) => {
    const { fchk_leave_requeste_employeeid,fchk_leave_requeste_firstname, fchk_leave_requeste_lastname,fchk_leave_requeste_type,fchk_leave_reason,fchk_leave_requeste_start_date,fchk_leave_requeste_end_date,fchk_leave_totaldays,fchk_leave_status,fchk_leave_requestdate} = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!fchk_leave_requeste_employeeid || !fchk_leave_requeste_firstname || !fchk_leave_requeste_lastname || !fchk_leave_requeste_type || !fchk_leave_reason || !fchk_leave_requeste_start_date || !fchk_leave_requeste_end_date || !fchk_leave_totaldays  || !fchk_leave_status || !fchk_leave_requestdate) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
    } else {
        connection.query("insert into leaverequests (employeeid,firstname,lastname,leavetype,reason,startdate,enddate,totaldays,status,requestdate) values(?,?,?,?,?,?,?,?,?,?)",[fchk_leave_requeste_employeeid,fchk_leave_requeste_firstname,
            fchk_leave_requeste_lastname,fchk_leave_requeste_type,fchk_leave_reason,fchk_leave_requeste_start_date,fchk_leave_requeste_end_date,fchk_leave_totaldays,
            fchk_leave_status,fchk_leave_requestdate],(err,results) => {
            if (err){
                console.error('Error inserting leaverequests:', err);
                return res.status(200).json({
                    status: 'error',
                    message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล leaverequest'
                }); 
            } else {
                res.status(201).json({
                    status: 'success',
                    // results: results,
                    message: 'ยื่นคำขอลาพักร้อนสำเร็จ',
                    redirectUrl: '/leave-request-success' 
                });
            }
        });
    }
});
//request success
router.get('/leave-request-success', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for leave_add:', req.session.user);
        res.render('leave-request-success', { user: req.session.user });
       
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

//สำหรับดึงประวัติการลาที่ได้มีการ Approved แล้ว
router.get('/leave-history', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for leave-history:', req.session.user);
        const employeeid = req.session.employeeid; 

        connection.query(
            "SELECT * FROM leaverequests WHERE employeeid = ? and status <> 'pending' ORDER BY leaverequestid DESC",
            [employeeid],
            (err, leaveHistory) => {
                if (err) {
                    console.error('Error query leaveHistory:', err);
                    return res.status(400).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการค้นหาประวัติการลา leaveHistory'
                    }); 
                } else {
                    res.render('leave-history', {
                        leaveHistory: leaveHistory, // ส่งข้อมูลประวัติการลาไปยัง view
                        user: req.session.user
                    });
                }
            }
        );
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

//สำหรับดึงรายการลาที่รอดำเนินการ
router.get('/leave-request-pending', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for leave-request-pending:', req.session.user);
        const employeeid = req.session.employeeid; 

        connection.query(
            "SELECT * FROM leaverequests WHERE employeeid = ? and status = 'pending' ",
            [employeeid],
            (err, leavePending) => {
                if (err) {
                    console.error('Error query leave-request-pending:', err);
                    return res.status(400).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการleave-request-pending'
                    }); 
                } else {
                    res.render('leave-request-pending', {
                        leavePending: leavePending, // ส่งข้อมูลประวัติการลาไปยัง view
                        user: req.session.user
                    });
                }
            }
        );
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});


///สำหรับยกเลิกคำขอลา:
router.post('/leave-request/cancel/:id', (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ status: 'error', message: 'กรุณาเข้าสู่ระบบ' });
    }
  
    const leaveRequestId = req.params.id;
  
    const cancelQuery = `
      UPDATE leaverequests
      SET status = 'cancelled'
      WHERE leaverequestid = ? AND status = 'pending'
    `;
  
    connection.query(cancelQuery, [leaveRequestId], (err, results) => {
      if (err) {
        console.error('Error cancelling leave request:', err);
        return res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาดในการยกเลิกคำขอ' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'ไม่สามารถยกเลิกคำขอที่ไม่อยู่ในสถานะรอดำเนินการได้'
        });
      }
  
      res.json({ status: 'success', message: 'ยกเลิกคำขอลาสำเร็จ' });
    });
  }); 

//สำหรับดึง Profile with signing
router.get('/leave-profile', (req, res) => {
    if (req.session.user) {
        console.log('Rendering home page for leave-profile:', req.session.user);
        const employeeid = req.session.employeeid; 

        connection.query("SELECT * FROM employee WHERE employeeid = ?",[employeeid],(err, leaveprofile) => {
                if (err){
                    console.error('Error query leaveHistory:', err);
                    return res.status(400).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการค้นหาประวัติการลา leave-profile'
                    }); 
                } else {
                    res.render('leave-profile', {
                    leaveprofile: leaveprofile, // ส่งข้อมูลประวัติการลาไปยัง view
                    user: req.session.user});
                }
            }
        );
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

// Route เพื่อรับข้อมูล updatedProfile และอัปเดตข้อมูลในฐานข้อมูล
router.post('/update-profile', (req, res) => {
    if (req.session.user) {
        console.log('Received update request for profile:', req.session.user);
        const employeeid = req.session.employeeid; 
        const updatedProfile = req.body; 
        console.log('Updated profile data:', updatedProfile); 

        const updateQuery = `
            UPDATE employee 
            SET email = ?, firstname = ?, lastname = ?, position = ?, department = ?, startdate = ?, leavebalance = ?
            WHERE employeeid = ?`;

        const values = [
            updatedProfile.email,
            updatedProfile.firstname,
            updatedProfile.lastname,
            updatedProfile.position,
            updatedProfile.department,
            updatedProfile.startdate,
            updatedProfile.leavebalance,
            employeeid
        ];

        connection.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error('Error updating profile:', err);
                return res.status(500).json({
                    status: 'error',
                    message: 'เกิดข้อผิดพลาดในการปรับปรุงข้อมูลโปรไฟล์'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'ปรับปรุงข้อมูลโปรไฟล์สำเร็จ',
                redirectUrl: '/leave-profile'
            });
            console.log('Profile updated successfully');
        });
    } else {
        console.log('No session found, redirecting to signin');
        res.status(401).json({
            status: 'error',
            message: 'กรุณาเข้าสู่ระบบก่อนทำการแก้ไขโปรไฟล์',
            redirectUrl: '/signin'
        });
    }
});



// Route สำหรับตรวจสอบวันลาคงเหลือ โดยดึง employeeId จาก session
router.get('/check-leave-balance', (req, res) => {
    const employeeId = req.session.employeeid; 

    if (!employeeId) {
        return res.status(401).json({
            status: 'error',
            message: 'กรุณาเข้าสู่ระบบก่อน'
        });
    }

    // ดึงข้อมูลวันลาเริ่มต้นและวันลาที่ใช้ไปของพนักงาน
    const query = `
        SELECT e.leavebalance, 
               COALESCE(SUM(lr.totaldays), 0) AS days_used
        FROM employee e
        LEFT JOIN leaverequests lr ON e.employeeid = lr.employeeid 
        AND lr.status = 'approved' -- เฉพาะใบลาที่อนุมัติแล้ว
        WHERE e.employeeid = ?
        GROUP BY e.employeeid;
    `;

    connection.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching leave balance:', err);
            return res.status(500).json({
                status: 'error',
                message: 'เกิดข้อผิดพลาดในการดึงข้อมูลวันลา'
            });
        }

        
        if (results.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ไม่พบข้อมูลพนักงาน'
            });
        }

        // คำนวณวันลาคงเหลือ
        const { leavebalance, days_used } = results[0];
        const remaining_days = leavebalance - days_used;

       
        res.status(200).json({
            status: 'success',
            leave_balance: leavebalance,
            days_used: days_used,
            remaining_days: remaining_days
        });
    });
});

router.get('/check/:employeeid', (req, res) => {
    const employeeId = req.params.employeeid;
    const query = `
        SELECT e.leavebalance, 
               COALESCE(SUM(lr.totaldays), 0) AS days_used
        FROM employee e
        LEFT JOIN leaverequests lr ON e.employeeid = lr.employeeid 
                                    AND lr.status = 'approved' -- เฉพาะใบลาที่อนุมัติแล้ว
        WHERE e.employeeid = ?
        GROUP BY e.employeeid;
    `;

    connection.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching leave balance:', err);
            return res.status(500).json({
                status: 'error',
                message: 'เกิดข้อผิดพลาดในการดึงข้อมูลวันลา'
            });
        }

        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if (results.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ไม่พบข้อมูลพนักงาน'
            });
        }

        // คำนวณวันลาคงเหลือ
        const { leavebalance, days_used } = results[0];
        const remaining_days = leavebalance - days_used;

        // ส่งผลลัพธ์กลับไป
        res.status(200).json({
            status: 'success',
            leave_balance: leavebalance,
            days_used: days_used,
            remaining_days: remaining_days
        });
    });
});                             
//Route สำหรับดึงข้อมูลวันลาที่ status = approved หรือ rejected เท่านั่น ตาม leaverequestid ล่าสุด
router.get('/leave-approvals', (req, res) => {
    if (req.session.user) {
        
        const queryCountApproved = `
            SELECT COUNT(*) AS approvedCount
            FROM leaverequests 
            WHERE status = 'approved'
        `;

        const queryCountRejected = `
            SELECT COUNT(*) AS rejectedCount
            FROM leaverequests 
            WHERE status = 'rejected'
        `;

        const queryCountTotal = `
            SELECT COUNT(*) AS totalCount
            FROM leaverequests
        `;

        const queryRecentLeaveRequests = `
            SELECT * 
            FROM leaverequests 
            WHERE status IN ('approved', 'rejected') 
            AND leaverequestid = (SELECT MAX(leaverequestid) FROM leaverequests WHERE status IN ('approved', 'rejected'))
        `;


        connection.query(queryCountApproved, (err, approvedResult) => {
            if (err) {
                console.error('Error querying count of approved requests:', err);
                return res.status(400).json({
                    status: 'error',
                    message: 'เกิดข้อผิดพลาดในการนับจำนวนใบคำขอที่ approved'
                });
            }

            const approvedCount = approvedResult[0].approvedCount;

           
            connection.query(queryCountRejected, (err, rejectedResult) => {
                if (err) {
                    console.error('Error querying count of rejected requests:', err);
                    return res.status(400).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการนับจำนวนใบคำขอที่ rejected'
                    });
                }

                const rejectedCount = rejectedResult[0].rejectedCount; 

             
                connection.query(queryCountTotal, (err, totalResult) => {
                    if (err) {
                        console.error('Error querying count of total requests:', err);
                        return res.status(400).json({
                            status: 'error',
                            message: 'เกิดข้อผิดพลาดในการนับจำนวนใบคำขอลาทั้งหมด'
                        });
                    }

                    const totalCount = totalResult[0].totalCount; 

               
                    connection.query(queryRecentLeaveRequests, (err, results) => {
                        if (err) {
                            console.error('Error querying recent leave requests:', err);
                            return res.status(400).json({
                                status: 'error',
                                message: 'เกิดข้อผิดพลาดในการดึงข้อมูล leave approvals'
                            });
                        } else {
                            
                            res.render('leave-approvals', {
                                leaveRequests_leave_approvals: results,
                                approvedCount: approvedCount, 
                                rejectedCount: rejectedCount, 
                                totalCount: totalCount,
                                user: req.session.user 
                            });
                        }
                    });
                });
            });
        });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});



              // (Route ส่วนสำหรับ Admin)
// Route สำหรับแสดงรายการคำขอลาทั้งหมด (สำหรับ Admin)
router.get('/admin', (req, res) => {
    if (req.session.user) {
        connection.query('SELECT * FROM leaverequests', (err, results) => {
            if (err){
                console.error('Error query leaverequests admin:', err);
                return res.status(400).json({
                    status: 'error',
                    message: 'เกิดข้อผิดพลาดในการค้นหาประวัติการลา leaveHistory'
                }); 
            } else {
                res.render('admin', {
                    leaveRequests: results, 
                user: req.session.user});
            }
        });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});
     
// Route สำหรับแสดงรายการคำขอลาทั้งหมด (สำหรับ Admin)
router.get('/admin-approvals', (req, res) => {
    if (req.session.user) {
        connection.query('SELECT * FROM leaverequests', (err, results) => {
            if (err){
                console.error('Error query leaverequests admin:', err);
                return res.status(400).json({
                    status: 'error',
                    message: 'เกิดข้อผิดพลาด admin-approvals'
                }); 
            } else {
                res.render('admin-approvals', {
                    leaveRequests: results, // ส่งข้อมูลประวัติการลาไปยัง view
                user: req.session.user});
            }
        });
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

// Route สำหรับอัปเดตสถานะของคำขอลาแล้ว 
router.post('/leave-request/:id/update', (req, res) => {
    if (req.session.user) {
        const { id } = req.params; // id ของใบลา
        const { status, employeeid } = req.body; // ดึง status และ employeeid จาก body

        // เริ่มต้นกระบวนการอัปเดตข้อมูล
        connection.query(
            'UPDATE leaverequests SET status = ? WHERE leaverequestid = ?',
            [status, id],
            (err) => {
                if (err) {
                    console.error('Error updating leave request status:', err);
                    return res.status(500).json({
                        status: 'error',
                        message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะใบลา'
                    });
                }

                console.log(`อัปเดตใบคำขอลา id: ${id} เป็นสถานะ: ${status} เรียบร้อยแล้ว`);

                // เพิ่มข้อความแจ้งเตือน
                const message = `ใบลาของคุณ (ID: ${id}) ได้รับการอัปเดตเป็นสถานะ: ${status}`;
                connection.query(
                    'INSERT INTO notifications (employeeid, message) VALUES (?, ?)',
                    [employeeid, message],
                    (err) => {
                        if (err) {
                            console.error('Error inserting notification:', err);
                            return res.status(500).json({
                                status: 'error',
                                message: 'เกิดข้อผิดพลาดในการสร้างข้อความแจ้งเตือน'
                            });
                        }

                        console.log('สร้างข้อความแจ้งเตือนสำเร็จ');
                        // เมื่อทำงานเสร็จสิ้นทั้งหมด ให้ redirect กลับไปหน้า admin-approvals
                        res.redirect('/admin-approvals');
                    }
                );
            }
        );
    } else {
        console.log('No session found, redirecting to signin');
        res.redirect('/signin');
    }
});

//Route สำหรับแสดงข้อความ: โดยใช้ employeeid
router.get('/api/notifications', (req, res) => {
    const employeeid = req.session.employeeid;

    if (!employeeid) {
        return res.status(401).json({ status: 'error', message: 'ไม่ได้เข้าสู่ระบบ' });
    }

    const query = `
        SELECT message, created_at, is_read 
        FROM notifications 
        WHERE employeeid = ? 
        ORDER BY created_at DESC 
        LIMIT 10
    `;

    connection.query(query, [employeeid], (err, notifications) => {
        if (err) {
            console.error('Error fetching notifications:', err.message);
            return res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือน' });
        }

        res.status(200).json({ status: 'success', notifications });
    });
});

// อัปเดตว่า notifications ถูกอ่านแล้วเมื่อเปิด dropdown:
router.post('/api/notifications/read', (req, res) => {
    const employeeid = req.session.employeeid;

    if (!employeeid) {
        return res.status(401).json({ status: 'error', message: 'ไม่ได้เข้าสู่ระบบ' });
    }

    const query = `UPDATE notifications SET is_read = TRUE WHERE employeeid = ?`;

    connection.query(query, [employeeid], (err) => {
        if (err) {
            console.error('Error marking notifications as read:', err.message);
            return res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการอ่าน' });
        }

        res.status(200).json({ status: 'success', message: 'อัปเดตสถานะการอ่านสำเร็จ' });
    });
});

// router.post('/mark-notifications-read', (req, res) => {
//     const employeeid = req.session.employeeid;

//     if (!employeeid) {
//         return res.status(401).json({
//             status: 'error',
//             message: 'ไม่ได้เข้าสู่ระบบ'
//         });
//     }

//     const query = `
//         UPDATE notifications 
//         SET is_read = TRUE 
//         WHERE employeeid = ?
//     `;

//     connection.query(query, [employeeid], (err) => {
//         if (err) {
//             console.error('Error marking notifications as read:', err.message);
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการอ่าน'
//             });
//         }

//         res.status(200).json({ status: 'success', message: 'อัปเดตข้อความเป็นอ่านแล้ว' });
//     });
// });

// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/signin');
   
});

module.exports = router;

