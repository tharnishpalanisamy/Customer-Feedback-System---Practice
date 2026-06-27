import { FEEDBACKAPI } from "./api.js"; 


let filteredFeedbacks = [] 

//filter options

let departmentFilter = document.getElementById('departmentFilter') 
let statusFilter = document.getElementById('statusFilter')
let searchTitle = document.getElementById('searchTitle') 
let ratingFilter = document.getElementById('ratingFilter')

//dynamic filtering 
async function dynamicFiltering(){
    let feedbacksData = await fetch(FEEDBACKAPI) 
    let feedbacks = await feedbacksData.json() 
    let rating = localStorage.getItem('rating') || 'All' 
    let department = localStorage.getItem('department') || 'All' 
    let status = localStorage.getItem('status') || 'All' 

    if(rating != 'All') {
        feedbacks = feedbacks.filter(feedback => Number(feedback.rating) >= Number(rating) ) 
    }

    if(department != 'All') {
        feedbacks = feedbacks.filter(feedback => feedback.department == department )  
    }

    if(status != 'All') {
        feedbacks = feedbacks.filter(feedback => feedback.status == status )  
    }
    departmentFilter.value = department 
    statusFilter.value = status 
    ratingFilter.value = Number(rating)  || 'All'
    console.log(Number(rating));
    
    localStorage.removeItem('rating')
    localStorage.removeItem('department')
    localStorage.removeItem('status')


    filteredFeedbacks = feedbacks 
    createFeedback(feedbacks)

}


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
        
        
        body.innerHTML += `
        <tr>
            <td>${((currentPage - 1 ) * items ) + index+1}</td>
            <td>${feedback.title}</td>
            <td>${feedback.username}</td>
            <td class = '${feedback.department}'>${feedback.department}</td>
            <td>${stars}</td>
            <td>${createdDate.getDate()}-${createdDate.getMonth()}-${createdDate.getFullYear()}</td>
            <td class = '${feedback.status}'>${feedback.status}</td>
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
    
    feedbacks.sort((a,b) => new Date(b.createdOn) - new Date(a.createdOn))
    filteredFeedbacks = feedbacks;
    currentPage = 1;
    showPage(filteredFeedbacks);
}

if(localStorage.getItem('department') || localStorage.getItem('status') || localStorage.getItem('rating')) {
    dynamicFiltering()
}
else{
displayFeedback()
}


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
                    Swal.fire({
                        title: "Logged Out!",
                        text: "The user has been logged out.",
                        icon: "success"
                    });
                    window.location.href = './login.html'
                }
            });    
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
    filteredFeedbacks = feedbacks;
    currentPage = 1;
    showPage(filteredFeedbacks);

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




//pagination 

const items = 10 
let totalPages = 0 
let currentPage = 1 


let pagination  = document.querySelector('.pagination') 

function createPages(feedbacks){
    totalPages = Math.ceil(feedbacks.length / items ) 
    
    pagination.innerHTML = `
    <li class = 'page-item ${currentPage == 1 ? 'disabled' : ''}'  >
        <button class = 'pageBtn page-link' data-type = 'previous'>Previous
        </button>
    </li>`

    for(let i = 1 ; i<= totalPages ; i++) {
        pagination.innerHTML += `
        <li class = 'page-item  ${i == currentPage ? 'active' : ''} '>
            <button class = 'page-link pageBtn' data-page = '${i}' > ${i}
            </button>
        </li>`
    }

    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <button class="page-link pageBtn" data-type="next">
                Next
            </button>
        </li> `
}


async function showPage(feedbacks){
    let start = (currentPage - 1 ) * items 
    let end = start + items
    let currentFeedbacks = feedbacks.slice(start , end) 
    createFeedback(currentFeedbacks) 
    createPages(feedbacks)
}

showPage()


//clicking each page 

pagination.addEventListener('click' , async function(event){
    if(event.target.classList.contains('pageBtn')) {
        let type = event.target.dataset.type 

        if(type == 'previous') {
            if(currentPage > 1) {
                currentPage --
            }
        }
        else if(type == 'next') {
            if (currentPage < totalPages) {
                currentPage ++
            }
        }
        else{
            currentPage = Number(event.target.dataset.page)
        }
        await showPage(filteredFeedbacks) 
    }
})


// async function init(){
//     let feedbacksData = await fetch(FEEDBACKAPI) 
//     let feedbacks = await feedbacksData.json()
//     await showPage(feedbacks)
// }
// init()