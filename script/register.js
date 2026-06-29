import { USERSAPI } from './api.js';


//toaster
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    timeOut: 3000
};
//create account 

//validate
async function validate(name, email, password, confirmPassword) {

    let nameInput = document.getElementById('name');
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    let confirmPasswordInput = document.getElementById('confirm-password');

    // Reset validation
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
    });

    // Empty validation
    let isValid = true;

    if (!name) {
        nameInput.classList.add("is-invalid");
        isValid = false;
    } else {
        nameInput.classList.add("is-valid");
    }

    if (!email) {
        emailInput.classList.add("is-invalid");
        isValid = false;
    } else {
        emailInput.classList.add("is-valid");
    }

    if (!password) {
        passwordInput.classList.add("is-invalid");
        isValid = false;
    } else {
        passwordInput.classList.add("is-valid");
    }

    if (!confirmPassword) {
        confirmPasswordInput.classList.add("is-invalid");
        isValid = false;
    } else {
        confirmPasswordInput.classList.add("is-valid");
    }

    if (!isValid) {
        toastr.warning("Required Fields cannot be empty");
        return false;
    }

    let nameRegex = /^[a-zA-Z ]{3,}$/;
    let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*=-])[a-zA-Z0-9!@#$%^&*=-]{8,}$/;

    // Name
    if (!nameRegex.test(name)) {
        nameInput.classList.remove("is-valid");
        nameInput.classList.add("is-invalid");
        toastr.warning("Name should only have letters and spaces");
        return false;
    }

    // Email format
    if (!emailRegex.test(email)) {
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");
        toastr.warning("Email format is wrong");
        return false;
    }

    // Email exists
    let emailData = await fetch(`${USERSAPI}?email=${email}`);
    let emailCheck = await emailData.json();

    if (emailCheck.length > 0) {
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");
        toastr.warning("Email already exists");
        return false;
    }

    // Password
    if (!passwordRegex.test(password)) {
        passwordInput.classList.remove("is-valid");
        passwordInput.classList.add("is-invalid");
        toastr.warning("Password should contain at least 1 capital, 1 number and 1 symbol");
        return false;
    }

    // Confirm password
    if (password !== confirmPassword) {
        confirmPasswordInput.classList.remove("is-valid");
        confirmPasswordInput.classList.add("is-invalid");
        toastr.warning("Passwords do not match");
        return false;
    }

    return true;
}

let registerBtn = document.getElementById('registerBtn') 

registerBtn.addEventListener('click' , async function(){
    try{
        let name = document.getElementById('name')
        let email = document.getElementById('email')
        let password = document.getElementById('password')
        let confirmPassword = document.getElementById('confirm-password')

        if(await validate(name.value , email.value , password.value , confirmPassword.value) === true) {
            let user = {
                name:name.value , 
                email:email.value , 
                password:password.value ,
                role:'User' , 
                createdOn:new Date().toISOString() , 
                phone : 'NA'
            }
            document.querySelector('.register-text').classList.add('d-none')
            document.querySelector('.register-spinner').classList.remove('d-none')
            registerBtn.disabled = true 

            await fetch(USERSAPI , {
                method:"POST" , 
                headers:{
                    'Content-type' : 'application/json'
                } , 
                body:JSON.stringify(user)
            })
            
            toastr.success('Account created')
            setTimeout(() => {
                document.querySelector('.register-text').classList.remove('d-none')
                document.querySelector('.register-spinner').classList.add('d-none')
                registerBtn.disabled = false 
                window.location.href = './login.html';
                name.value = '' 
                email.value = '' 
                password.value = '' 
                confirmPassword.value = ''

            }, 1200);

            
        }
    }
    catch(error){
        console.log(error);
    }
})


document.getElementById("name").addEventListener("input", function () {
    this.classList.remove("is-invalid", "is-valid");
});

document.getElementById("email").addEventListener("input", function () {
    this.classList.remove("is-invalid", "is-valid");
});

document.getElementById("password").addEventListener("input", function () {
    this.classList.remove("is-invalid", "is-valid");
});

document.getElementById("confirm-password").addEventListener("input", function () {
    this.classList.remove("is-invalid", "is-valid");
});