import { USERSAPI , FEEDBACKAPI } from './api.js';


//toaster
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    timeOut: 3000
};

//getting the user 
let user = JSON.parse(localStorage.getItem('user')) || '' 
if(!user) {
    alert('Please login first') 
    window.location.href = './login.html' 
}

let firstName = document.getElementById('name').value
document.getElementById('name').innerText = `Welcome ${user.name} ,`


//showing statistics
async function displayStatistics(){
    try{
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
        document.querySelector('.averageRating').innerText = Math.round(totalRating / totalFeedback) || 0 
        document.querySelector('.responseRate').innerText = Math.round((totalResponse / totalFeedback ) * 100) + ' %' || 0 
    }
    catch(error){
        console.log(error);
    }
}

displayStatistics()

//adding feeback 

//validating feedback 

function validateFeedback(title , feedback , rating , department){
    if(!title || !feedback || !rating || !department ) {
        toastr.warning('Fields cannot be empty') 
        return false 
    }
    return true 
}

//userRating 
let ratingValue = 0 
let ratingContainer = document.getElementById('ratingContainer') 
ratingContainer.addEventListener('click' , function(event){
    if(event.target.classList.contains('rating-star')) {
        let rating = event.target.dataset.value 
        ratingValue = rating
        console.log(rating);
        let stars = document.querySelectorAll('.rating-star') 
        stars.forEach(star => {
            if (Number(star.dataset.value) <= Number(rating)) {
                star.classList.remove('bi-star')
                star.classList.add("bi-star-fill") 
            }
            else{
                star.classList.add('bi-star')
                star.classList.remove("bi-star-fill",) 
            }
        })
        
    }
})

let saveFeedbackBtn = document.getElementById('saveFeedbackBtn') 

saveFeedbackBtn.addEventListener('click' , async  function(){
    let title = document.getElementById('title') 
    let feedback = document.getElementById('feedback') 
    let department = document.getElementById('department') 
    let valid = validateFeedback(title.value , feedback.value , ratingValue , department.value)
    if(valid) {
        let feebackData = { 
            userId:user.id,
            username:user.name,
            email:user.email,
            title:title.value ,
            department:department.value, 
            feedback:feedback.value , 
            rating : ratingValue , 
            createdOn : new Date().toISOString() , 
            active:1 , 
            response:"-" , 
            respondedOn:'',
            status:'Pending' 
        }
        toastr.success('Feedback added')
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
        ratingValue = 0
        let stars = document.querySelectorAll('.rating-star') 
        stars.forEach(star => {
                star.classList.add('bi-star')
                star.classList.remove("bi-star-fill",) 
            })
        displayStatistics()
        let modalElement = document.getElementById('feedbackModal') 
        let modal = bootstrap.Modal.getInstance(modalElement) 
        modal.hide()
    }


    

})



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


//logout 
let logoutBtn = document.getElementById('logoutBtn') 
logoutBtn.addEventListener('click' , async function(){
    Swal.fire({
                title: "Are you sure?",
                text: "Do you want Logout ?",
                icon: "warning",
                showCancelButton: true,
                reverseButtons: true, 
                confirmButtonColor: "#d33", 
                cancelButtonColor:"#3085d6",
                confirmButtonText: "Yes, Logout!"
            }).then( (result) => {
                if (result.isConfirmed) {
                    document.querySelector('.logout-text').classList.add('d-none') 
                    document.querySelector('.logout-spinner').classList.remove('d-none') 
                    logoutBtn.disabled = true  
                    localStorage.removeItem('user')
                    localStorage.removeItem('theme')
                    setTimeout(() => {
                        Swal.fire({
                        title: "Logged Out!",
                        text: "The user has been logged out.",
                        icon: "success"
                    });
                    }, 1000);

                    setTimeout(() => {
                        document.querySelector('.logout-text').classList.remove('d-none') 
                        document.querySelector('.logout-spinner').classList.add('d-none') 
                        logoutBtn.disabled = false
                        window.location.href = './login.html'
                    }, 2000);
                    
                    
                }
            });    
        }
)  