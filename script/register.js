import { USERSAPI } from './api.js';

//create account 

//validate
async function validate(name , email , password , confirmPassword){
    if(!name || !email || !password ||!confirmPassword) {
        alert('replacewith toaster') 
        return false ; 
    }
    let nameRegex = /^[a-zA-Z ]{3,}$/ 
    let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/  
    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*=-])[a-zA-Z0-9!@#$%^&*=-]{8,}$/

    if(!nameRegex.test(name)){
        alert('Name should only have letters and spaces') ; 
        return false ; 
    }
    if(!emailRegex.test(email)){
        alert('email format is wrong') ; 
        return false ; 
    }
    let emailData = await fetch(`${USERSAPI}?email=${email}`) 
    let emailCheck = await emailData.json() 

    if(emailCheck.length > 0) {
        alert('email already exists') ; 
        return false
    }

    if(!passwordRegex.test(password)) {
        alert('Password should contain atleast 1 capital , 1 number and 1 symbol') 
        return false 
    }
    if(password != confirmPassword) {
        alert('passwords does not match')
        return false 
    }

    return true 

}

let registerBtn = document.getElementById('registerBtn') 

registerBtn.addEventListener('click' , async function(){
    let name = document.getElementById('name')
    let email = document.getElementById('email')
    let password = document.getElementById('password')
    let confirmPassword = document.getElementById('confirm-password')

    if(await validate(name.value , email.value , password.value , confirmPassword.value) === true) {
        let user = {
            name:name.value , 
            email:email.value , 
            password:password.value , 
            createdOn:new Date().toISOString() 
        }

        await fetch(USERSAPI , {
            method:"POST" , 
            headers:{
                'Content-type' : 'application/json'
            } , 
            body:JSON.stringify(user)
        })
        
        alert('Account created')
        window.location.href = './login.html'

        name.value = '' 
        email.value = '' 
        password.value = '' 
        confirmPassword.value = ''
    }
})