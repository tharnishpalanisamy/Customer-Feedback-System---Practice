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
                phone : 'NA', 
                status : 'Active'
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


//errors 
let nameError = document.querySelector('.nameError')
let emailError = document.querySelector('.emailError')
let passwordError = document.querySelector('.passwordError')
let confirmPasswordError = document.querySelector('.confirmPasswordError')


let name = document.getElementById("name")
let nameRegex = /^[a-zA-Z ]{3,}$/;
let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*=-])[a-zA-Z0-9!@#$%^&*=-]{8,}$/;

name.addEventListener("input", function () {
    name.classList.remove("is-invalid", "is-valid"); 
    nameError.innerHTML = ""
    if(!name.value) {
        nameError.innerHTML = 'Name Cannot be Empty'
        name.classList.add('is-invalid')
        return 
    }
    if(name.value.length < 3  ) {
        nameError.innerHTML = 'Name should be atleast 3 characters long' 
        name.classList.add('is-invalid')
        return 
    }
    if(!nameRegex.test(name.value)) {
        nameError.innerHTML = 'Name should only have letters and spaces'
        name.classList.add('is-invalid')
        return 
    }
    name.classList.add('is-valid')
    

});

let email = document.getElementById("email")
email.addEventListener("input", async function () {
    email.classList.remove("is-invalid", "is-valid");
    emailError.classList.remove("text-success");
    emailError.innerHTML = "";

    if (!email.value.trim()) {
        emailError.innerHTML = "Email cannot be empty.";
        email.classList.add("is-invalid");
        return;
    }

    if (!emailRegex.test(email.value.trim())) {
        emailError.innerHTML = "Please enter a valid email address (e.g., name@example.com).";
        email.classList.add("is-invalid");
        return;
    }

    let response = await fetch(`${USERSAPI}?email=${encodeURIComponent(email.value.trim())}`);
    let duplicateEmail = await response.json();

    if (duplicateEmail.length > 0) {
        emailError.innerHTML = "Email already exists.";
        email.classList.add("is-invalid");
        return;
    }

    emailError.innerHTML = "Valid email!";
    emailError.classList.add("text-success");
    email.classList.add("is-valid");
});

let password = document.getElementById("password")
password.addEventListener("input", function () {
    password.classList.remove("is-invalid", "is-valid"); 
    passwordError.innerHTML = ""
    if(!password.value) {
        passwordError.innerHTML = "Password cannot be empty" 
        password.classList.add('is-invalid') ; 
        return 
    }

    if(!passwordRegex.test(password.value)) {
        passwordError.innerHTML = "Password must be 8-15 characters and include uppercase, lowercase, a number, and a special character." 
        password.classList.add('is-invalid') ; 
        return
    }
    passwordError.innerHTML = "" 
    password.classList.add('is-valid') ; 

});
let confirmPassword = document.getElementById("confirm-password")
confirmPassword.addEventListener("input", function () {
    confirmPassword.classList.remove("is-invalid", "is-valid"); 

    if(!confirmPassword.value) {
        confirmPasswordError.innerHTML = 'This field cannot be empty' ; 
        confirmPassword.classList.add('is-invalid')
        return ; 
    }

    if (password.value != confirmPassword.value) {
        confirmPasswordError.innerHTML = "Passwords Doesn't Match !" ; 
        confirmPassword.classList.add('is-invalid')
        return ; 
    }

    confirmPasswordError.innerHTML = '' ; 
    confirmPassword.classList.add('is-valid')
});