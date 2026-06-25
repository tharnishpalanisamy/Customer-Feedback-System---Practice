import { USERSAPI } from './api.js';

//login 

let loginBtn = document.getElementById('loginBtn') 

loginBtn.addEventListener('click' , async function(){
    let email = document.getElementById('email') 
    let password = document.getElementById('password') 
    let role = document.querySelector('input[name="role"]:checked')
    console.log(role);
    
    if(!email.value || !password.value) {
        alert('invalid') 
        return ; 
    }

    let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/  
    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*=-]{8,}$/    

    let userData = await fetch(`${USERSAPI}?email=${email.value}&password=${password.value}`) 
    let user = await userData.json() 

    if(user.length == 1 && role.value == 'user') {
        if (user[0].role == 'user' ) {
        localStorage.setItem('user' , JSON.stringify(user[0]))
        window.location.href = './user.html'
        }
        else{
            alert('Wrong role selected')
        }
    }
    else if(user.length == 1 && role.value == 'admin') {
        if (user[0].role == 'admin' ) {
        localStorage.setItem('user' , JSON.stringify(user[0]))
        window.location.href = './admin.html'
        }
        else{
            alert('Wrong role selected')
        }
    }
    else{
        alert('User not found ! Please create an account')
    }

})