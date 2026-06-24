
//if user previously has dark theme

if(localStorage.getItem('theme') == 'dark') {
    changeTheme()
}

//change theme 
function changeTheme() {
    document.body.classList.toggle('dark')

    dark.classList.toggle('d-none')
    light.classList.toggle('d-none')

    dark2.classList.toggle('d-none')
    light2.classList.toggle('d-none')

    localStorage.setItem(
        'theme',
        document.body.classList.contains('dark') ? 'dark' : 'light'
    )
}


theme.addEventListener('click', changeTheme)
theme2.addEventListener('click', changeTheme)







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