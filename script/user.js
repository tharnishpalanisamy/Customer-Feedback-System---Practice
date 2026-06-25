import { USERSAPI , FEEDBACKAPI } from './api.js';


//theme

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



//getting the user 
let user = JSON.parse(localStorage.getItem('user')) || '' 
if(!user) {
    alert('Please login first') 
    window.location.href('../index.html')
}

let firstName = document.getElementById('name').value
document.getElementById('name').innerText = `Welcome ${user.name} ,`


//showing statistics
async function displayStatistics(){
    let feedbackData = await fetch(`${FEEDBACKAPI}?userId=${user.id}`) 
    let feedbacks = await feedbackData.json()  

    let totalFeedback = feedbacks.length 
    let totalResponse = 0 
    let totalRating = 0 

    feedbacks.forEach(feedback =>{
        totalRating += Number(feedback.rating)
        if(feedback.status == 'Responded') {
            totalResponse++
        }
    })

    document.querySelector('.feedbackCount').innerText = totalFeedback 
    document.querySelector('.responseCount').innerText = totalResponse 
    document.querySelector('.averageRating').innerText = Math.round(totalRating / totalFeedback) 
    document.querySelector('.responseRate').innerText = Math.round((totalResponse / totalFeedback ) * 100) + ' %'
}

displayStatistics()






//adding feeback 

//validating feedback 

function validateFeedback(title , feedback , rating , department){
    if(!title || !feedback || !rating || !department ) {
        alert('Fields cannot be empty') 
        return false 
    }
    return true 
}

let saveFeedbackBtn = document.getElementById('saveFeedbackBtn') 

saveFeedbackBtn.addEventListener('click' , async  function(){
    let title = document.getElementById('title') 
    let feedback = document.getElementById('feedback') 
    let rating = document.getElementById('rating')
    let department = document.getElementById('department') 
    let valid = validateFeedback(title.value , feedback.value , rating.value , department.value)
    if(valid) {
        let feebackData = { 
            userId:user.id,
            username:user.name,
            email:user.email,
            title:title.value ,
            department:department.value, 
            feedback:feedback.value , 
            rating : rating.value , 
            createdOn : new Date().toISOString() , 
            active:1 , 
            remarks:"-" , 
            status:'Pending' 
        }

        await fetch(`${FEEDBACKAPI}` , {
            method:"POST" , 
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(feebackData)
        })


        //closing the modal 
        title.value = '' 
        feedback.value = '' 
        rating.value = ''
        displayStatistics()
        let modalElement = document.getElementById('feedbackModal') 
        let modal = bootstrap.Modal.getInstance(modalElement) 
        modal.hide()
    }


    

})



//dynamic view / filtering based on user choice

// let totalView = document.getElementById('totalView') 
// totalView.addEventListener('click' , function(){
//     localStorage.setItem('status','All')
//     window.location.href = './userfeedback.html'
// })


let responseView = document.getElementById('responseView') 
responseView.addEventListener('click' , function() {
    localStorage.setItem('status' , 'Responded') 
    window.location.href = './userfeedback.html'
})

let ratingView = document.getElementById('ratingView') 
ratingView.addEventListener('click' , function(){
    localStorage.setItem('status','All') 
    let rating = document.querySelector('.averageRating').innerText 
    localStorage.setItem('rating' , rating) 
    window.location.href = './userfeedback.html'
})


let responseRateView = document.getElementById('responseRateView') 
responseRateView.addEventListener('click' , function() {
    localStorage.setItem('status' , 'Pending') 
    window.location.href = './userfeedback.html'
})