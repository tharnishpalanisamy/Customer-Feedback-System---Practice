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

