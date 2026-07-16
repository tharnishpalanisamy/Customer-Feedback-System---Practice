import { USERSAPI } from './api.js';



//toaster
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    timeOut: 3000
};

function removeSpinner(){
    document.querySelector('.login-text').classList.remove('d-none')
    document.querySelector('.login-spinner').classList.add('d-none')
    loginBtn.disabled = false 
}
//login 

let loginBtn = document.getElementById('loginBtn') 

loginBtn.addEventListener('click', async function () {

    try{
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        let role = document.querySelector('input[name="role"]:checked');

        // Reset validation
        email.classList.remove("is-valid", "is-invalid");
        password.classList.remove("is-valid", "is-invalid");

        let isValid = true;

        // Empty validation
        if (!email.value.trim()) {
            email.classList.add("is-invalid");
            isValid = false;
        } else {
            emailError.innerHTML = '';
            email.classList.add("is-valid");
        }

        if (!password.value.trim()) {
            password.classList.add("is-invalid");
            isValid = false;
        } else {
            password.classList.add("is-valid");
        }

        if (!isValid) {
            toastr.warning("Email and Password cannot be empty");
            return;
        }

        //spinner

        document.querySelector('.login-text').classList.add('d-none')
        document.querySelector('.login-spinner').classList.remove('d-none')
        loginBtn.disabled = true 


        let userData = await fetch(`${USERSAPI}?email=${email.value}&password=${password.value}`);
        let user = await userData.json();

        if (user.length == 1 && role.value == 'User') {

            if (user[0].role == 'User') {
                localStorage.setItem('user', JSON.stringify(user[0]));
                toastr.success('Login successful')
                setTimeout(() => {
                    removeSpinner()
                    window.location.href = './user.html';
                    email.value = ""
                    password.value = ""
                }, 3000);
                
            }
            else {
                toastr.warning('Wrong role selected');
                removeSpinner()
            }

        }
        else if (user.length == 1 && role.value == 'Admin') {

            if (user[0].role == 'Admin') {
                localStorage.setItem('user', JSON.stringify(user[0]));
                localStorage.setItem('showToast' , true)
                toastr.success('Login successful')
                setTimeout(() => {
                    removeSpinner()
                    window.location.href = './admin.html';
                    email.value = ""
                    password.value = "" 
                }, 3000);
                
            }
            else {
                removeSpinner()
                toastr.warning('Wrong role selected');
            }

        }
        else {
            removeSpinner()
            toastr.error('User not found! Please create an account');
            emailError.innerHTML = 'User not found !'
            email.classList.remove("is-valid");
            password.classList.remove("is-valid");

            email.classList.add("is-invalid");
            password.classList.add("is-invalid");
        }
    }
    catch(error){
        console.log(error);
        removeSpinner();
        toastr.error("Unable to connect to server.");
    }

});

let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
let emailError = document.querySelector('.emailError')
email.addEventListener("input", function () {
    email.classList.remove("is-invalid");
    if(!email.value) {
        emailError.innerHTML = 'Email cannot be empty' 
        email.classList.add("is-invalid");
        return 
    }
    if (!emailRegex.test(email.value.trim())) {
        emailError.innerHTML = "Please enter a valid email address (e.g., name@example.com).";
        email.classList.add("is-invalid");
        return;
    }
    emailError.innerHTML = '' 
    email.classList.add("is-valid");
});

let passwordError = document.querySelector('.passwordError')
password.addEventListener("input", function () {
    password.classList.remove("is-invalid");
    if(!password.value) {
        passwordError.innerHTML = 'Password cannot be empty' ; 
        password.classList.add("is-invalid");
        return ; 

    }
    password.classList.remove("is-invalid");
    passwordError.innerHTML =''

});