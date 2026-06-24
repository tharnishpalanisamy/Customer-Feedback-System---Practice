//theme
let theme = document.getElementById('theme') 
let dark = document.getElementById('dark') 
let light = document.getElementById('light') 
theme.addEventListener('click' , function(){
    dark.classList.toggle('d-none') 
    light.classList.toggle('d-none')
    document.body.classList.toggle('dark')
})

//desktop theme
let theme2 = document.getElementById('theme2') 
let dark2 = document.getElementById('dark2') 
let light2 = document.getElementById('light2') 
theme2.addEventListener('click' , function(){
    dark2.classList.toggle('d-none') 
    light2.classList.toggle('d-none')
    document.body.classList.toggle('dark')
})
