import { USERSAPIAPI } from './api.js';

//login 

let loginBtn = document.getElementById('loginBtn') 

loginBtn.addEventListener('click' , async function(){
    let email = document.getElementById('email') 
    let password = document.getElementById('password') 

    if(!email.value || !password.value) {
        alert('invalid') 
        return ; 
    }

    let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/  
    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*=-]{8,}$/    

    let userData = await fetch(`${USERSAPIAPI}?email=${email.value}&password=${password.value}`) 
    let user = await userData.json() 

    if(user.length == 1) {
        alert('login successful')
        localStorage.setItem('user' , JSON.stringify(user[0]))
        window.location.href = './user.html'
    }

})