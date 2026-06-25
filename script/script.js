
//login
let login = document.getElementById('login') 

login.addEventListener('click' , function(){
    document.querySelector('.login-text').classList.add('d-none') 
    document.querySelector('.login-spinner').classList.remove('d-none')
    login.disabled = true 

    setTimeout(() => {
        window.location.href = 'pages/login.html'
        document.querySelector('.login-text').classList.remove('d-none') 
        document.querySelector('.login-spinner').classList.add('d-none')
        login.disabled = false 
    }, 1000);
})

//sign up
let register = document.getElementById('register') 
register.addEventListener('click' , function(){
    document.querySelector('.register-text').classList.add('d-none') 
    document.querySelector('.register-spinner').classList.remove('d-none')
    register.disabled = true 

    setTimeout(() => {
        window.location.href = 'pages/register.html'
        document.querySelector('.register-text').classList.remove('d-none') 
        document.querySelector('.register-spinner').classList.add('d-none')
        register.disabled = false 
    }, 1000);
})