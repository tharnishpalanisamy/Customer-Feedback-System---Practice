import { FEEDBACKAPI } from "./api.js"; 


//displaying the feedbacks 

//creatung feedback
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
            <td>${index+1}</td>
            <td>${feedback.title}</td>
            <td>${feedback.username}</td>
            <td>${feedback.department}</td>
            <td>${stars}</td>
            <td>${createdDate.getDate()}-${createdDate.getMonth()}-${createdDate.getFullYear()}</td>
            <td class = '${feedback.status} text'>${feedback.status}</td>
            <td>
                <i class="bi bi-eye-fill active viewBtn fs-5" title="View" data-id = ${feedback.id} data-bs-toggle="modal" data-bs-target="#viewFeedbackModal"></i>

                <i class="bi bi-pencil-square fs-5 ms-3 ${feedback.status =='Pending' ?
                     'text-success responseBtn' : 'blocked'}
                 title="Respond"  data-id = ${feedback.id} 
                 ${feedback.status =='Pending' ? ' data-bs-toggle="modal" data-bs-target="#respondModal"' : ''} ></i>
            </td>
        </tr>
        `
    })
}

//displaying function 

async function displayFeedback(){
    let feedbacksData = await fetch(FEEDBACKAPI) 
    let feedbacks = await feedbacksData.json()
    console.log(feedbacks);
    
    feedbacks.sort((a,b) => new Date(b.createdOn) - new Date(a.createdOn))
    createFeedback(feedbacks)
}

displayFeedback()


//loading data in view model  
//modal elements
let modalName = document.querySelector('.modalName') 
let modalRating = document.querySelector('.modalRating') 
let modalDate = document.querySelector('.modalDate') 
let modalFeedback = document.querySelector('.modalFeedback')
let title = document.querySelector('.title')

//Response modal elements
let responseName = document.getElementById('responseName') 
let responseEmail = document.getElementById('responseEmail') 
let responseRating = document.getElementById('responseRating') 
let responseFeedback = document.getElementById('responseFeedback') 
let response = document.getElementById('response') 



let currentFeedback ; 

document.addEventListener('click' , async function(event){
    if(event.target.classList.contains('viewBtn')) {
        currentFeedback = event.target.dataset.id ; 
        console.log(currentFeedback);
        
        let feedbackData = await fetch(`${FEEDBACKAPI}/${currentFeedback}`) 
        let data = await feedbackData.json() 
        console.log(data);
        
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

    //respond 

    else if (event.target.classList.contains('responseBtn')) {
        currentFeedback = event.target.dataset.id 
        
        let feedbackData = await fetch(`${FEEDBACKAPI}/${currentFeedback}`) 
        let data = await feedbackData.json() 
        responseName.value = data.username
        responseEmail.value = data.email 
        responseFeedback.value = data.feedback 
        responseRating.value = data.rating 
        
    }
})


//saving the response 

let saveResponse = document.getElementById('saveResponse') 
saveResponse.addEventListener('click' , async function(){
    if(!response.value) {
        alert('Please add the response')
        return ; 
    }

    await fetch(`${FEEDBACKAPI}/${currentFeedback}` , {
        method:'PATCH' , 
        headers:{
            'Content-type' : 'application/json' 
        } , 
        body:JSON.stringify({
            response:response.value ,
            respondedOn: new Date().toISOString() , 
            status:'Responded'
        })
    })

    displayFeedback()
    response.value = "";
    //dismiss the modal 
    let modalElement = document.getElementById('respondModal') 
    let modal = bootstrap.Modal.getInstance(modalElement) 
    modal.hide()



})




//filtering 


let departmentFilter = document.getElementById('departmentFilter') 
let statusFilter = document.getElementById('statusFilter')
let searchTitle = document.getElementById('searchTitle') 
let ratingFilter = document.getElementById('ratingFilter')


async function filterFeedback(){
    let dept = departmentFilter.value;
    let status = statusFilter.value;
    let value = searchTitle.value.toLowerCase();  
    let rating = ratingFilter.value

    let response = await fetch(`${FEEDBACKAPI}`);
    let feedbacks = await response.json();

    if (dept !== 'All') {
        feedbacks = feedbacks.filter(feedback => feedback.department === dept);
    }

    if (status !== 'All') {
        feedbacks = feedbacks.filter(feedback => feedback.status === status);
    }

    if (value !== '') {
        feedbacks = feedbacks.filter(feedback => feedback.title.toLowerCase().includes(value));
    }
    if(rating != 'All') {
        rating = Number(rating) 
        if(rating > 1) {
        feedbacks = feedbacks.filter(feedback => Number(feedback.rating) >= rating)
        }
        else if(rating == 1 ){
            feedbacks = feedbacks.filter(feedback => Number(feedback.rating) == rating)
        }
    }

    feedbacks.sort((a,b) =>{
        return new Date(b.createdOn) - new Date(a.createdOn)
    })
    createFeedback(feedbacks);

}

//dept
departmentFilter.addEventListener('change' , async function(){
    await filterFeedback()
    searchTitle.value = ''
})
//status
statusFilter.addEventListener('change' , async function(){
    await filterFeedback()
    searchTitle.value = ''
})

//search 

searchTitle.addEventListener('input' ,async function(){
    await filterFeedback()

})

//rating

ratingFilter.addEventListener('change' , async function(){
    await filterFeedback()
    searchTitle.value = ''
})