import { USERSAPI , FEEDBACKAPI } from './api.js';  


//user
let user = JSON.parse(localStorage.getItem('user'))

//dynamic filtering 
let userStatus = localStorage.getItem('status') || 'All' 
let userRating = Number(localStorage.getItem('rating')) || 'All';
console.log(userRating);

async function dynamicFiltering(){
    let feedbackData = await fetch(`${FEEDBACKAPI}?userId=${user.id}`) 
    let feedbacks = await feedbackData.json() 
    if(userStatus != 'All') {
        feedbacks = feedbacks.filter(feedback => feedback.status == userStatus) 
    }
    if(userRating != 'All') {
        feedbacks  = feedbacks.filter(feedback => {
            if(userRating == 1) {
                return feedback.rating == 1 
            }
            else{
                return feedback.rating >= userRating
            }
        })
    }

    document.getElementById('statusFilter').value = userStatus 
    console.log(typeof(userRating));
    
    document.getElementById('ratingFilter').value = userRating
    createFeedback(feedbacks)
    localStorage.removeItem('status')
    localStorage.removeItem('rating')
}


//if table is empty 


//creating feedback 

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
        
        let responseDate = new Date(feedback.respondedOn)
        body.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${feedback.title}</td>
            <td>${stars}</td>
            <td>${feedback.department}</td>
            <td>${feedback.feedback}</td>
            <td class = '${feedback.status} text'>${feedback.status}</td>
            <td>${createdDate.getDate()}-${createdDate.getMonth()}-${createdDate.getFullYear()}</td>
            <td class = 'text-center'>
            ${feedback.respondedOn? `${responseDate.getDate()}-${responseDate.getMonth()}-${responseDate.getFullYear()}`
                  :'-'}</td> 
            <td class = 'text-center'>${feedback.response || '-'}</td>
            <td class='text-center' >
            <i class="bi bi-pencil-square fs-5  ${feedback.status == 'Pending' ? 'active editFeedbackIcon' : 'blocked'}" 
            ${feedback.status=='Pending' ? ` data-bs-toggle="modal" data-bs-target="#editFeedbackModal" 
                data-id = ${feedback.id}  ` : ''}
            ></i>
            </td>
            
        </tr>
        `
    })
}


//displaying feedbacks 

async function displayFeedback(){
    let feedbackData = await fetch(FEEDBACKAPI) 
    let feedbacks = await feedbackData.json() 
    let userFeedbacks = feedbacks.filter(feedback => feedback.userId = user.id)
    userFeedbacks.sort((a,b)=>{
        return new Date(b.createdOn) - new Date(a.createdOn) 
    })
    createFeedback(userFeedbacks)
}

if(localStorage.getItem('status')){
    dynamicFiltering()
}
else{
displayFeedback()
}


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

    let response = await fetch(`${FEEDBACKAPI}?userId=${user.id}`);
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


//edit icon in action 
let currentId = ''


//elements of edit modal 
let editTitle = document.getElementById('editTitle') 
let editDepartment = document.getElementById('editDepartment') 
let editFeedback = document.getElementById('editFeedback')
let editRating = document.getElementById('editRating') 


document.addEventListener('click' , async  function(event){
    if(event.target.classList.contains('editFeedbackIcon')){
        currentId = event.target.dataset.id         
        
        let feedbackData = await fetch(`${FEEDBACKAPI}?id=${currentId}`) 
        let feedback = await feedbackData.json() 

        let data = feedback[0] 

        editTitle.value = data.title 
        editDepartment.value = data.department 
        editRating.value = data.rating  
        editFeedback.value = data.feedback
    }
})


//Feedback Validation
function validateFeedback(title , feedback , rating , department){
    if(!title || !feedback || !rating || !department ) {
        alert('Fields cannot be empty') 
        return false 
    }
    return true 
}

//saving edited feedback 
let saveBtn = document.getElementById('saveBtn') 
saveBtn.addEventListener('click' , async function(){
    let isValid = validateFeedback(editTitle.value , editFeedback.value , editRating.value , editDepartment.value) 

    if(isValid) {
        let editedFeedback = {
            title:editTitle.value , 
            department:editDepartment.value , 
            rating:editRating.value , 
            feedback:editFeedback.value , 
            updatedOn:new Date().toISOString()
        }

        await fetch(`${FEEDBACKAPI}/${currentId}` , {
            method:"PATCH" , 
            headers : {
                'Content-type' : 'application/json'
            } , 
            body:JSON.stringify(editedFeedback)
        })
    }
    await filterFeedback()



    //closing the modal 
    let modalElement = document.getElementById('editFeedbackModal') 
    let modal = bootstrap.Modal.getInstance(modalElement) 
    modal.hide()
    
})
