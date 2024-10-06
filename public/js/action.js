
let input = document.querySelector("#input_username");

window.addEventListener("load", (e)=>{
  input.focus(); // adding the focus
})

// function goto_login() { 
//     const error_msg_login = $("#error_msg_login");
//     $(error_msg_login).hide();
//     let check_username = document.getElementById("input_username").value;
//     let check_password = document.getElementById("input_password").value;
//     if (check_username.length <= 0 || (check_username == null )){
//         $(error_msg_login).show();
//         error_msg_login.html("กรุณากรอก Username").css("color", "red")
//         document.getElementById("input_username").focus();
//         return false
//     } else if (check_password.length <= 0 || (check_password == "")){
//         $(error_msg_login).show();
//         error_msg_login.html("กรุณากรอก Password").css("color", "red")
//         document.getElementById("input_password").focus();
//         return false     
//     } else {
//         $.ajax({
//             method: 'post',
//             url: 'http://localhost:3000/signin',
//             data: {  
//                 username: check_username, //ส่ง Req      //คือ ส่งทั้ง form $('#signupform').serialize(),
//                 password: check_password,
//             },
            
//             success: (response) => {
//                     window.location.href = '/home';
//                 // } else {
              
//             },
            
//             error: (err) => {
//                 console.log('bad', err)
//             }
//         })
//     }
// }

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
        return false;
    } else if (chk_password.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอก Password',
            confirmButtonText: 'OK'
        });
        document.getElementById("input_password").focus();
        return false;
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
            //  if (response.status === 200) {
            //  if(response.RespCode == 200) {
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
    const chk_signup_firstname = document.getElementById("txt-modal-signup-firstname").value;
    const chk_signup_lastname = document.getElementById("txt-modal-signup-lastname").value;
    const chk_signup_email = document.getElementById("txt-modal-signup-email").value;
    const chk_signup_position = document.getElementById("txt-modal-signup-position").value;
    const chk_signup_start_date = document.getElementById("txt-modal-signup-start_date").value;
    const chk_signup_password = document.getElementById("txt-modal-signup-password").value;
    const chk_signup_confrim_password = document.getElementById("txt-modal-signup-confrim-password").value;
    const chk_signup_remaining_leaves = document.getElementById("txt-modal-signup-remaining_leaves").value;


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
    } else if (chk_signup_email.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกอีเมลล์").css("color","red")
        document.getElementById("txt-modal-signup-email").focus();
        return false
    } else if (chk_signup_position.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกตำแหน่งงาน").css("color","red")
        document.getElementById("txt-modal-signup-position").focus();
        return false
    } else if (chk_signup_start_date.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกวันที่เริ่มทำงาน").css("color","red")
        document.getElementById("txt-modal-signup-start_date").focus();
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
        
    } else if (chk_signup_remaining_leaves.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอกสิทธิวันลา").css("color","red")
        document.getElementById("txt-modal-remaining_leaves").focus();
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
                fchk_signup_firstname: chk_signup_firstname,
                fchk_signup_lastname: chk_signup_lastname,
                fchk_signup_email: chk_signup_email,
                fchk_signup_position: chk_signup_position,
                fchk_signup_start_date: chk_signup_start_date,
                fchk_signup_password: chk_signup_password,
                fchk_signup_confrim_password: chk_signup_confrim_password,
                fchk_signup_remaining_leaves: chk_signup_remaining_leaves
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
                    window.location.href = response.redirectUrl;  // เปลี่ยนเส้นทางไปยังหน้า profile/home
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
    window.location.href = '../index.html'
        }
    })
}
