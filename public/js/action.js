
let input = document.querySelector("#input_username");

window.addEventListener("load", (e)=>{
  input.focus(); // adding the focus
})

function validat_signin() {
    let chk_username = document.getElementById("input_username").value;
    let chk_password = document.getElementById("input_password").value;

    if (chk_username.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอก Username',
            confirmButtonText: 'OK'
        });
        document.getElementById("input_username").focus();
    } else if (chk_password.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอก Password',
            confirmButtonText: 'OK'
        });
        document.getElementById("input_password").focus();
    } else {
        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: chk_username,
                password: chk_password
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.status === 'success') {
                Swal.fire({
                    position: "top-end",
                    icon: 'success',
                    title: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = response.redirectUrl;  // Redirect to profile/home
                });
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
            console.error('Error during login request', err);
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
    const chk_signup_role = document.getElementById("txt-modal-signup-role").value;
    const chk_signup_total_leave_days = document.getElementById("txt-modal-signup-total_leave_days").value;
    const chk_signup_remaining_leave_days = document.getElementById("txt-modal-signup-remaining_leave_days").value;


    // const chk_signup_box = document.getElementById("invalidCheck").value;
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
    } else if (chk_signup_role.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกตำแหน่งงาน").css("color","red")
        document.getElementById("txt-modal-signup-role").focus();
        return false
    } else if (chk_signup_total_leave_days.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกจำนวนวันลาที่ได้สิทธิ์").css("color","red")
        document.getElementById("txt-modal-signup-total_leave_days").focus();
        return false
    } else if (chk_signup_remaining_leave_days.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกวันลาที่เหลือ").css("color","red")
        document.getElementById("txt-modal-signup-remaining_leave_days").focus();
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
                fchk_signup_role: chk_signup_role,
                fchk_signup_total_leave_days: chk_signup_total_leave_days,
                fchk_signup_remaining_leave_days: chk_signup_remaining_leave_days
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
                    position: "top-end",
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

function gotologout() {
    Swal.fire({
        icon: "warning",
        title: 'Are you sure to Logout ?',
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Logout`,
    }).then((result) => {
        if (result.isDenied) {
    window.location.href = '../signin'
        }
    })
}
