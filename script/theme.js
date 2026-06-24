//theme

//if user previously has dark theme

if(localStorage.getItem('theme') == 'dark') {
    changeTheme()
}

//change theme 
function changeTheme() {
    document.body.classList.toggle('dark')
    document.getElementById('dark').classList.toggle('d-none')
    document.getElementById('light').classList.toggle('d-none')
    localStorage.setItem(
        'theme',
        document.body.classList.contains('dark') ? 'dark' : 'light'
    )
}

document.getElementById('theme').addEventListener('click', changeTheme)








