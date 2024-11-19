

let input = document.querySelector("#input_username");

window.addEventListener("load", (e)=>{
  input.focus(); // adding the focus
})

function validat_signin() {
    const error_msg_signin_user = $("#error_msg_signin_user");
    const error_msg_signin_password = $("#error_msg_signin_password");
        error_msg_signin_user.hide().removeClass('alert alert-danger');
        error_msg_signin_password.hide().removeClass('alert alert-danger');
    const chk_username = document.getElementById("input_username").value.trim();
    const chk_password = document.getElementById("input_password").value.trim();

    if (chk_username.length === 0) {
        error_msg_signin_user.addClass('alert alert-danger').show().html("กรุณากรอก Username");
        document.getElementById("input_username").focus();
    } else if (chk_password.length === 0) {
        error_msg_signin_password.addClass('alert alert-danger').show().html("กรุณากรอก Password");
        document.getElementById("input_password").focus();
    } else {
        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fchk_username: chk_username,
                fchk_password: chk_password
            })
        })
        .then(response => {
            // ตรวจสอบว่าผลลัพธ์เป็น JSON หรือไม่
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // แปลง response ให้เป็น JSON
        })
        .then(response => {
            if (response.status === 'success') {
                window.location.href = response.redirectUrl;
                Swal.fire({
                    // position: "top-end",
                    icon: 'success',
                    title: response.message,
                 
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = response.redirectUrl;
                });
                console.log(response.data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: response.message,
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'There was an error processing your request. Please try again.',
                confirmButtonText: 'OK'
            });
            console.error('Error during login request:', err);
        });
    }
}


function validate_signup(){
    const error_msg_register = $("#error_msg_register");
    error_msg_register.hide();
    const chk_signup_empid = document.getElementById("txt-modal-signup-empid").value;
    const chk_signup_email = document.getElementById("txt-modal-signup-email").value;
    const chk_signup_password = document.getElementById("txt-modal-signup-password").value;
    const chk_signup_confrim_password = document.getElementById("txt-modal-signup-confrim-password").value;
    const chk_signup_firstname = document.getElementById("txt-modal-signup-firstname").value;
    const chk_signup_lastname = document.getElementById("txt-modal-signup-lastname").value;
    const chk_signup_position = document.getElementById("txt-modal-signup-position").value;
    const chk_signup_department = document.getElementById("txt-modal-signup-department").value;
    const chk_signup_startdate = document.getElementById("txt-modal-signup-startdate").value;
    const chk_signup_role = document.getElementById("txt-modal-signup-leaverole").value;
    const chk_signup_leavebalance = document.getElementById("txt-modal-signup-leavebalance").value;
    // if(document.getElementById("txt-modal-signup-empid").value=="" || document.getElementById("txt-modal-signup-email").value==""){
    //     alert("Please fill Username and Password "); 
    //     return;}
    var isChecked = document.querySelector('input[type="checkbox"]').checked;
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   
    if (chk_signup_empid.length <= 0 || (chk_signup_empid == "" )) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกเลขพนักงาน',
            confirmButtonText: 'OK'
        });
        document.getElementById("txt-modal-signup-empid").focus();
        return false
    } else if (chk_signup_email.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกอีเมลล์").css("color","red")
        document.getElementById("txt-modal-signup-email").focus();
        return false
    } else if (chk_signup_password.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก password").css("color","red")
        document.getElementById("txt-modal-signup-password").focus();
        return false
    } else if (chk_signup_confrim_password.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก confrim password").css("color","red")
        document.getElementById("txt-modal-signup-confrim-password").focus();
        return false

    } else if (chk_signup_firstname.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกชื่อ").css("color","red")
        document.getElementById("txt-modal-signup-firstname").focus();
        return false
    } else if (chk_signup_lastname.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกนามสกุล").css("color","red")
        document.getElementById("txt-modal-signup-lastname").focus();
        return false
    } else if (chk_signup_position.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกตำแหน่งงาน").css("color","red")
        document.getElementById("txt-modal-signup-position").focus();
        return false
    } else if (chk_signup_department.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกฝ่าย/แผนก").css("color","red")
        document.getElementById("txt-modal-signup-department").focus();
        return false
    } else if (chk_signup_startdate.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกวันที่เริ่มทำงาน").css("color","red")
        document.getElementById("txt-modal-signup-startdate").focus();
        return false
    } else if (chk_signup_role.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณาเลือกสถานะผู้ใช้งาน").css("color","red")
        document.getElementById("ttxt-modal-signup-leaverole").focus();
        return false
    } else if (chk_signup_leavebalance.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกวันลาตามสิทธิ์").css("color","red")
        document.getElementById("txt-modal-signup-leavebalance").focus();
        return false
    } else if(!isChecked) {
        error_msg_register.show();
        error_msg_register.html("กรุณากด ยอมรับนโยบายความเป็นส่วนตัว").css("color","red")
        // alert("You must accept the terms before proceeding");
        return false
    //fomat email
    } else if (!filter.test(chk_signup_email)) {
        $(error_msg_register).show();
        error_msg_register.html("รูปแบบ Email ไม่ถูกต้อง").css("color", "red")
        document.getElementById("txt-modal-signup-email").focus();
        return false 
    
    } else {
        // console.log("Sign Up Request")
        // ส่งข้อมูลแบบ POST ไปยัง API /signup
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fchk_signup_empid: chk_signup_empid,
                fchk_signup_email: chk_signup_email,
                fchk_signup_password: chk_signup_password,
                fchk_signup_confrim_password: chk_signup_confrim_password,
                fchk_signup_firstname: chk_signup_firstname,
                fchk_signup_lastname: chk_signup_lastname,
                fchk_signup_position: chk_signup_position,
                fchk_signup_department: chk_signup_department,
                fchk_signup_startdate: chk_signup_startdate,
                fchk_signup_role: chk_signup_role,
                fchk_signup_leavebalance: chk_signup_leavebalance
            })
        })
        .then(response => {
            // ตรวจสอบว่าผลลัพธ์เป็น JSON หรือไม่
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // แปลง response ให้เป็น JSON
        })
        .then(response => {
            // ตรวจสอบ status ที่ส่งกลับมาจากเซิร์ฟเวอร์
            
            if (response.status === 'success') {
               
                Swal.fire({
                    // position: "top-end",
                    icon: 'success',
                    title: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = response.redirectUrl;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: response.message || 'Signup Failed',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Signup Failed',
                text: 'There was an error processing your request. Please try again.',
                confirmButtonText: 'OK'
            });
            console.error('Error during signup request:', err);
        });
    }

}

function validate_leave_request(){
    const chk_leave_requeste_employeeid = document.getElementById("leave_requeste_employeeid").value;
    const chk_leave_requeste_firstname = document.getElementById("leave_requeste_firstname").value;
    const chk_leave_requeste_lastname = document.getElementById("leave_requeste_lastname").value;
    const chk_leave_requeste_type = document.getElementById("leave_requeste_type").value;
    const chk_leave_reason = document.getElementById("leave_reason").value;
    const chk_leave_requeste_start_date = document.getElementById("leave_requeste_start_date").value;
    const chk_leave_requeste_end_date = document.getElementById("leave_requeste_end_date").value;
    const chk_leave_totaldays = document.getElementById("leave_totaldays").value;
    const chk_leave_status = "pending";
    const chk_leave_requestdate = document.getElementById("leave_requestdate").value;
   
    // ฟังก์ชันเพื่อแปลงวันที่ให้อยู่ในรูปแบบที่ถูกต้อง
    // function isValidDate(Date) {
    //     // ตรวจสอบรูปแบบวันที่ว่าอยู่ในรูปแบบที่ถูกต้อง (เช่น YYYY-MM-DD)
    //     var regEx = /^\d{4}-\d{2}-\d{2}$/;
    //     if(!Date.match(regEx)) return false;  // ถ้ารูปแบบไม่ถูกต้อง
    // }
     // แปลงค่าวันที่เริ่มต้นและวันที่สิ้นสุดเป็นออบเจ็กต์ Date
     let startDate = new Date(chk_leave_requeste_start_date);
     let endDate = new Date(chk_leave_requeste_end_date);
     let requesteDate = new Date(chk_leave_requestdate);
     if (startDate > endDate) {
         Swal.fire({
             icon: 'error',
             title: 'วันที่เริ่มต้องไม่มากกว่าวันที่สิ้นสุด',
             confirmButtonText: 'OK'
         });
         document.getElementById("leave_requeste_start_date").focus();
         return false;
     }
    if (chk_leave_requeste_employeeid.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกเลขพนักงาน',
            confirmButtonText: 'OK'
        });
        document.getElementById("leave_requeste_employeeid").focus();
        return false
    } else if (chk_leave_requeste_firstname.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกชื่อ',
            confirmButtonText: 'OK'
        });
        document.getElementById("leave_requeste_firstname").focus();
        return false
    } else if(chk_leave_requeste_lastname.length <= 0){
        Swal.fire({
            icon:"error",
            title: "กรุณากรอกชื่อ",
            confirmButtonText: "OK" 
        });
        document.getElementById("leave_requeste_lastname").focus();
        return false
    } else if(chk_leave_requeste_lastname.length <= 0){
        Swal.fire({     
            icon: "error",
            title: "กรุณากรอกนามสกุล",
            confirmButtonText: "OK",
        });
        return false
    } else if(chk_leave_requeste_type.length <= 0){
        Swal.fire({
            icon: "error",
            title: "กรูณากรอกประเภทการลา",
            confirmButtonText: "OK"
        });
        return false
    } else if(chk_leave_reason.length <= 0){
        Swal.fire({
            icon: "error",
            title: "กรุณากรอกเหตุผลการลา",
            confirmButtonText: "OK"
        });
        return false
    } else if (chk_leave_requeste_start_date.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกวันที่เริ่มต้น (MM/DD/YYYY)',
            confirmButtonText: 'OK'
        });
        document.getElementById("leave_requeste_start_date").focus();
        return false;
    } else if (chk_leave_requeste_end_date.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกวันที่สิ้นสุด (MM/DD/YYYY)',
            confirmButtonText: 'OK'
        });
        document.getElementById("leave_requeste_end_date").focus();
        return false;
   
    } else if(chk_leave_totaldays.length <= 0){
        Swal.fire({
            icon: "error",
            title: "กรูณากรอกจำนวนวันที่ขอลา",
            confirmButtonText: "OK"   
        });
        return false
        
    } else if(chk_leave_requestdate.length <= 0){
        Swal.fire({
            icon: "error",
            title: "กรูณากรอกวันที่ขอลา",
            confirmButtonText: "OK"   
        });
        document.getElementById("leave_requestdate").focus();
        return false
    } else if(chk_leave_reason.length <= 0){
        Swal.fire({
            icon: "error",
            title: "กรูรากรอกเหตุผลการลา",
            confirmbuttontext: "OK"
        }); 
        return false
    } else {
        fetch('http://localhost:3000/leave-request',{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                fchk_leave_requeste_employeeid: chk_leave_requeste_employeeid,
                fchk_leave_requeste_firstname: chk_leave_requeste_firstname,
                fchk_leave_requeste_lastname: chk_leave_requeste_lastname,
                fchk_leave_requeste_type: chk_leave_requeste_type,
                fchk_leave_reason: chk_leave_reason,
                fchk_leave_requeste_start_date: chk_leave_requeste_start_date,
                fchk_leave_requeste_end_date: chk_leave_requeste_end_date,
                fchk_leave_totaldays: chk_leave_totaldays,  
                fchk_leave_status: chk_leave_status,
                fchk_leave_requestdate: chk_leave_requestdate,          
            })

        })
        .then(response => {
            // ตรวจสอบว่าผลลัพธ์เป็น JSON หรือไม่
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // แปลง response ให้เป็น JSON
        })
        .then(response => {
            // ตรวจสอบ status ที่ส่งกลับมาจากเซิร์ฟเวอร์
            if (response.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: response.message,
                    timer: 1500,
                    // confirmButtonText: 'OK'
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = response.redirectUrl;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: response.message || 'leave_requeste Failed',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: response.message,
                // title: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
                // text: 'There was an error processing your request. Please try again.',
                confirmButtonText: 'OK'
            });
            console.error('Error during leave_requeste request:', err);
        });
    }
}


function editProfile(button) {
    const card = button.closest('.card');
    const inputs = card.querySelectorAll('.edit-input');
    
    // Enable editing and toggle buttons
    inputs.forEach(input => input.readOnly = false);
    button.classList.add('d-none');
    card.querySelector('.save-btn').classList.remove('d-none');
  }

// ฟังก์ชัน saveProfile ใน frontend
function saveProfile(button) {
    const card = button.closest('.card');
    const inputs = card.querySelectorAll('.edit-input');

    // เก็บข้อมูลที่ถูกอัปเดตใน updatedProfile
    const updatedProfile = {};
    inputs.forEach(input => {
        input.readOnly = true;
        updatedProfile[input.getAttribute('name')] = input.value;
    });
    
    button.classList.add('d-none');
    card.querySelector('.edit-btn').classList.remove('d-none');
  
    console.log('Data to be sent to the server:', updatedProfile); // ตรวจสอบข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์

    fetch('http://localhost:3000/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(response => {
        if (response.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: response.message,
                showConfirmButton: true
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: response.message || 'update-profile Failed',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'update-profile Failed',
            text: 'There was an error processing your request. Please try again.',
            confirmButtonText: 'OK'
        });
        console.error('Error during update-profile request:', err);
    });
}


// // ฟังก์ชันตรวจสอบวันลาคงเหลือ
// function check_leavebalance() {
//     const chk_leave_requeste_employeeid = document.getElementById("leave_requeste_employeeid").value;

//     fetch('http://localhost:3000/check-leave-balance', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             fchk_leave_requeste_employeeid: chk_leave_requeste_employeeid
            
//         })
        
//     })
    
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(response => {
//         if (response.status === 'success') {
//             Swal.fire({
//                 icon: 'success',
//                 title: response.message,
//                 showConfirmButton: true
//             });
//         } else {
//             Swal.fire({
//                 icon: 'error',
//                 title: response.message || 'check-leave-balance Failed',
//                 confirmButtonText: 'OK'
//             });
//         }
//     })
//     .catch(err => {
//         Swal.fire({
//             icon: 'error',
//             title: 'check-leave-balanceFailed',
//             text: 'There was an error processing your request. Please try again.',
//             confirmButtonText: 'OK'
//         });
//         console.error('Error during check-leave-balance request:', err);
//     });
// }


// // การเรียกใช้ฟังก์ชันและแสดงผล
// const employeeId = 123; // รหัสพนักงานที่ต้องการตรวจสอบ
// checkLeaveBalance(employeeId, (err, leaveBalance) => {
//     if (err) {
//         console.error("Error:", err.message);
//     } else {
//         console.log(`วันลาคงเหลือของพนักงานรหัส ${employeeId}: ${leaveBalance} วัน`);
//     }
// });


// function gotologout() {
//     Swal.fire({
//         icon: "warning",
//         title: 'Are you sure to Logout ?',
//         showConfirmButton: false,
//         showDenyButton: true,
//         showCancelButton: true,
//         confirmButtonText: 'Save',
//         denyButtonText: `Logout`,
//     }).then((result) => {
//         if (result.isDenied) {
//     window.location.href = '../signin'
//         }
//     })
// }



