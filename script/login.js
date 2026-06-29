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

            email.classList.remove("is-valid");
            password.classList.remove("is-valid");

            email.classList.add("is-invalid");
            password.classList.add("is-invalid");
        }
    }
    catch(error){
        console.log(error);
    }

});
email.addEventListener("input", function () {
    email.classList.remove("is-invalid");
});

password.addEventListener("input", function () {
    password.classList.remove("is-invalid");
});