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
if(!user){
    window.location.href = './login.html'
}


//fetching the statistics for dashboard 

async function displayStatistics(){
    try{
        let data = await fetch(`${FEEDBACKAPI}`)
        let feedbacks = await data.json() 

        let length = feedbacks.length 
        let pending = 0 
        let responded = 0 
        let totalRating = 0 

        feedbacks.forEach(feedback =>{
            totalRating += Number(feedback.rating) 
            feedback.status == 'Pending' ? pending ++ : responded ++ 
        })

        //puting the values
        document.getElementById('totalFeedback').innerText =length 
        document.getElementById('pendingCount').innerText = pending 
        document.getElementById('respondedCount').innerText = responded 
        document.getElementById('averageRating').innerText = Math.round(totalRating / length).toFixed(1) 

        document.querySelector('.count').innerText = pending
        document.querySelector('.toastCount').innerText = `👋 Welcome back, Admin! There are ${pending} feedbacks Waiting to be reviewed`
        
    }
    catch(error){
        console.log('error'); 
        toastr.error('Something Went Wrong !')   
    }
}

displayStatistics()


//admin dashboard table 
//Creating feedback
function createFeedback(feedbacks){
    let table = document.querySelector('.table') 
    let body = table.querySelector('tbody') 
    body.innerHTML = "" 
    if (feedbacks.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-5 text-secondary">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    No feedback found.
                </td>
            </tr>
        `;
        return;
    }
    
    feedbacks.forEach((feedback,index) =>{
        let createdDate = new Date(feedback.createdOn) 
        let n =  Number(feedback.rating)
        
        let stars = '' 
        for(let i = 1 ; i<= n ; i++){
            stars += '⭐'
        }
        console.log(stars);
        
        
        body.innerHTML += `
        <tr>
            <td>${feedback.title}</td>
            <td>${feedback.username}</td>
            <td class = '${feedback.department}'>${feedback.department}</td>
            <td>${stars}</td>
            <td class = '${feedback.status}'>${feedback.status}</td>
            <td class="text-center">
                <button title = 'View' class="btn btn-sm btn-primary viewBtn" data-id = ${feedback.id}  data-bs-toggle="modal" data-bs-target="#viewFeedbackModal" >
                    <i class="bi bi-eye me-1" title = 'View'></i> View
                </button>
            </td>
        </tr>
        `
    })
}

async function displayLatestFeedback(){
    try{
        let feedbackData = await fetch(`${FEEDBACKAPI}`) 
        let data = await feedbackData.json() 
        data.sort((a,b) => new Date(b.createdOn) - new Date(a.createdOn)) 
        data = data.splice(0,5) 
        createFeedback(data)
    }
    catch(error) {
        console.log(error);
        toastr.error('Something went wrong')
    }
}

displayLatestFeedback()



//modal elements
let modalName = document.querySelector('.modalName') 
let modalRating = document.querySelector('.modalRating') 
let modalDate = document.querySelector('.modalDate') 
let modalFeedback = document.querySelector('.modalFeedback')
let title = document.querySelector('.title')

let currentFeedback ; 

document.addEventListener('click' , async function(event){
    if(event.target.classList.contains('viewBtn')) {
        try{
            currentFeedback = event.target.dataset.id ; 
            let feedbackData = await fetch(`${FEEDBACKAPI}/${currentFeedback}`) 
            let data = await feedbackData.json()             
            modalName.innerText = data.username 
            let stars = '' 
            let n = Number(data.rating) 
            for(let i = 1 ; i <= n ; i++) {
                stars += '★'
            }
            let diff = 5 - n 
            let remainingStars = ""
            for (let i = 1 ; i <= diff ; i++) {
                remainingStars += '★'
            }

            modalRating.innerHTML = `<p>${stars}<span class = "text-secondary" >${remainingStars}</span></p>`

            let date = new Date(data.createdOn) 
            modalDate.innerText = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}` 

            modalFeedback.innerText = data.feedback
            title.innerText = data.title
        }
        catch(error){
            console.log(error); 
            toastr.error('something Went Wrong')
        }
    }
    else if(event.target.classList.contains('logoutBtn')) {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want Logout ?",
            icon: "warning",
            showCancelButton: true,
            reverseButtons: true, // Confirm button moves to the right
            confirmButtonColor: "#d33", 
            cancelButtonColor:"#3085d6",
            confirmButtonText: "Yes, Logout!"
        }).then( (result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('user')
                localStorage.removeItem('theme')
                document.querySelectorAll('.logout-text').forEach(el => el.classList.add('d-none')  )
                document.querySelectorAll('.logout-spinner').forEach(el => el.classList.remove('d-none')  )
                document.querySelectorAll('.logoutBtn').forEach(el => el.disabled = true  )
                
                setTimeout(() => {
                    Swal.fire({
                    title: "Logged Out!",
                    text: "You have been logged out.",
                    icon: "success"
                }, 1000);
                });
                setTimeout(() => {
                    document.querySelectorAll('.logout-text').forEach(el => el.classList.remove('d-none')  )
                    document.querySelectorAll('.logout-spinner').forEach(el => el.classList.add('d-none')  )
                    document.querySelectorAll('.logoutBtn').forEach(el => el.disabled = false  )
                    window.location.href = './login.html'
                }, 2000);
                
            }
        });    
    }
})



//rating distribution 

async function calculateDistribution(){
    try{
        let feedbackData = await fetch(FEEDBACKAPI) 
        let feedbacks = await feedbackData.json() 
        let five = 0 
        let four = 0 
        let three  = 0
        let two = 0 
        let one = 0 
        let n = feedbacks.length
        let health = 0 
        let healthCount = 0 
        let administration = 0 
        let administrationCount = 0 
        let lawAndOrder = 0 
        let lawCount = 0 
        let infrastructure = 0 
        let infraCount = 0 


        feedbacks.forEach(feedback => {
            if(feedback.rating == 5) {
                five ++
            }
            else if(feedback.rating == 4) {
                four ++
            }
            else if(feedback.rating == 3) {
                three ++
            }
            else if(feedback.rating == 2 ) {
                two ++
            }
            else if(feedback.rating == 1 ) {
                one ++
            }

            //for avg rating dept wise
            if(feedback.department == 'Administration') {
                administration += Number(feedback.rating)
                administrationCount ++
            }
            else if(feedback.department == 'Infrastructure') {
                infrastructure += Number(feedback.rating)
                infraCount++
            }
            else if(feedback.department == 'Law and Order') {
                lawAndOrder += Number(feedback.rating)
                lawCount ++
            }
            else if(feedback.department == 'Health Care') {
                health += Number(feedback.rating)
                healthCount ++
            }

        })
        console.log(n);
        console.log(healthCount);
            
        //count  
        document.querySelector('.totalFeedbackCount').innerText = `(Total Feedback - ${n})`
        document.querySelector('.fiveCount').innerText = `(${five})` 
        document.querySelector('.fourCount').innerText = `(${four})` 
        document.querySelector('.threeCount').innerText = `(${three})` 
        document.querySelector('.twoCount').innerText = `(${two})` 
        document.querySelector('.oneCount').innerText = `(${one})` 

        //2nd chart counts 
        document.querySelector('.healthCount').innerText = `(${healthCount})`
        document.querySelector('.infrastructureCount').innerText = `(${infraCount})`
        document.querySelector('.lawAndOrderCount').innerText = `(${lawCount}`
        document.querySelector('.administrationCount').innerText = `(${administrationCount})`
        document.querySelector('.overallCount').innerText = `(${n})`  
        let max = Math.max(five, four, three, two, one);

        five = (five/max) * 100 
        four = (four/max)  * 100 
        three = (three / max )  * 100 
        two = (two /max)  * 100 
        one = (one /max)  * 100 
        
        document.querySelector('.fiveStar').style.width = `${five}%`
        document.querySelector('.fourStar').style.width = `${four}%`
        document.querySelector('.threeStar').style.width = `${three}%`
        document.querySelector('.twoStar').style.width = `${two}%`
        document.querySelector('.oneStar').style.width = `${one}%`

        
        //dept wise average rating 
        document.querySelector('.healthCareWidth').style.width = `${((health / healthCount)/5)*100}%`
        document.querySelector('.infrastructureWidth').style.width = `${((infrastructure / infraCount)/5)*100}%`
        document.querySelector('.lawAndOrderWidth').style.width = `${((lawAndOrder / lawCount)/5)*100}%`
        document.querySelector('.administrationWidth').style.width = `${((administration / administrationCount)/5)*100}%`
        document.querySelector('.overallWidth').style.width = `${(((health + infrastructure + lawAndOrder + administration)/n)/5)*100}%`
        

        //inside progress bar
        document.querySelector('.healthCareWidth').textContent = `${(health / healthCount).toFixed(1)} ★`;
        document.querySelector('.infrastructureWidth').textContent = `${(infrastructure / infraCount).toFixed(1)} ★`;
        document.querySelector('.lawAndOrderWidth').textContent = `${(lawAndOrder / lawCount).toFixed(1)} ★`;
        document.querySelector('.administrationWidth').textContent = `${(administration / administrationCount).toFixed(1)} ★`;
        document.querySelector('.overallWidth').textContent = `${((health + infrastructure + lawAndOrder + administration) / n).toFixed(1)} ★`;
    }
    catch(error){
        console.log(error); 
        toastr.error('Something went Wrong')
        
    }
}

calculateDistribution()


//dynamic filtering 

//view 

let pendingView = document.getElementById('pendingView') 
pendingView.addEventListener('click' , function(){
    localStorage.setItem('status' , 'Pending') 
    window.location.href = './adminfeedback.html'
})


let respondedView = document.getElementById('respondedView') 
respondedView.addEventListener('click' , function(){
    localStorage.setItem('status' , 'Responded') 
    window.location.href = './adminfeedback.html'
})

let averageRatingView = document.getElementById('averageRatingView') 
averageRatingView.addEventListener('click' , function(){
    let rating = document.getElementById('averageRating')
    localStorage.setItem('rating' , rating.textContent)
    window.location.href = './adminfeedback.html'
})


if(localStorage.getItem('showToast')) {
    const toastElement = document.getElementById("welcomeToast");

    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });

    toast.show();
    localStorage.removeItem('showToast')
}