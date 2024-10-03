
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




function goto_register(){
    const error_msg_register = $("#error_msg_register");
    error_msg_register.hide();
    const check_register_fname = document.getElementById("txt_modal_register_fname").value;
    const check_register_lname = document.getElementById("txt_modal_register_lname").value;
    const check_register_dept = document.getElementById("txt_modal_register_dept").value;
    const check_register_salary = document.getElementById("txt_modal_register_salary").value;
    const check_register_username = document.getElementById("txt_modal_register_username").value;
    const check_register_password = document.getElementById("txt_modal_register_password").value;
    const check_register_email = document.getElementById("txt_modal_register_email").value;
    // const check_register_fname = $("#txt_modal_register_fname")



    //let check_format_register_email = document.getElementById("txt_modal_register_email");
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


    //Fullname
    if (check_register_fname.length <= 0 || (check_register_fname == "" )) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก fname").css("color", "red") 
        document.getElementById("txt_modal_register_fname").focus();
        return false
    //Username
    } else if (check_register_lname.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก lastname").css("color","red")
        document.getElementById("txt_modal_register_lname").focus();
        return false
    } else if (check_register_dept.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก Department").css("color","red")
        document.getElementById("txt_modal_register_dept").focus();
        return false
    } else if (check_register_salary.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก Salary").css("color","red")
        document.getElementById("txt_modal_register_salary").focus();
        return false

    } else if (check_register_username.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก Username").css("color","red")
        document.getElementById("txt_modal_register_username").focus();
        return false
    
    } else if (check_register_password.length <= 0) {
        error_msg_register.show();
        error_msg_register.html("กรุณากรอก Password").css("color","red")
        document.getElementById("txt_modal_register_password").focus();
        return false
    //fomat email
    } else if (!filter.test(check_register_email)) {
        $(error_msg_register).show();
        error_msg_register.html("รูปแบบ Email ไม่ถูกต้อง").css("color", "red")
        document.getElementById("txt_modal_register_email").focus();
        return false 
    
    } else {
        console.log("Register Request")
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/create_signup',
            data: {
                data_reg_fname : check_register_fname,
                data_reg_lname : check_register_lname,
                data_reg_dept : check_register_dept,
                data_reg_salary : check_register_salary,
                data_reg_email : check_register_email,
                data_reg_username : check_register_username,
                data_reg_password: check_register_password,
            },
         
            success: function(response) {
                console.log("Response Register Success")
                if (response.RespCode == 200){
                    Swal.fire({
                        icon: 'success',
                        title: 'register success', // timer: 1000 
                    })

                } else if (response.RespCode == 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Email ซ้ำ กรุณาใช้ email อื่น!'
                    })
                    //$("#closeaddmodal").trigger('click')
                }
            },
            error: function(err) {
                console.log('bad', err)
            }

        })
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
