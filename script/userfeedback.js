import { USERSAPI , FEEDBACKAPI } from './api.js';  


//toaster
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    timeOut: 3000
};

//
let finalFeedbacks = [] 
//user
let user = JSON.parse(localStorage.getItem('user'))

//dynamic filtering 
let userStatus = localStorage.getItem('status') || 'All' 
let userRating = Number(localStorage.getItem('rating')) || 'All';

async function dynamicFiltering(){
    try{
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
        
        document.getElementById('ratingFilter').value = userRating
        finalFeedbacks = feedbacks 
        currentPage = 1 
        showPage(finalFeedbacks)
        localStorage.removeItem('status')
        localStorage.removeItem('rating')
    }
    catch(error){
        console.log(error);
    }
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
        
        let responseDate = new Date(feedback.respondedOn)
        body.innerHTML += `
        <tr>
            <td>${((currentPage - 1)* items)+index+1}</td>
            <td>${feedback.title}</td>
            <td>${stars}</td>
            <td class = '${feedback.department}' >${feedback.department}</td>
            <td>${feedback.feedback}</td>
            <td class = '${feedback.status} '>${feedback.status}</td>
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
            <i class="bi bi-trash3 fs-5 ms-2  
            ${feedback.status =='Pending' ? 'text-danger deleteFeedbackIcon':'blocked text-dark'} " data-id = ${feedback.id}></i>
            </td>
            
        </tr>
        `
    })
}


//displaying feedbacks 

async function displayFeedback(){
    try{
        let feedbackData = await fetch(FEEDBACKAPI) 
        let feedbacks = await feedbackData.json() 
        let userFeedbacks = feedbacks.filter(feedback => feedback.userId == user.id)
        userFeedbacks.sort((a,b)=>{
            return new Date(b.createdOn) - new Date(a.createdOn) 
        })
        finalFeedbacks = userFeedbacks 
        currentPage = 1 
        showPage(finalFeedbacks)
    }
    catch(error){
        console.log(error);
    }
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
    finalFeedbacks = feedbacks 
    currentPage = 1 
    showPage(finalFeedbacks)

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


document.addEventListener('click' , async  function(event){
    if(event.target.classList.contains('editFeedbackIcon')){
        try{
            currentId = event.target.dataset.id         
        
            let feedbackData = await fetch(`${FEEDBACKAPI}?id=${currentId}`) 
            let feedback = await feedbackData.json() 

            let data = feedback[0] 
            editRatingValue = Number(data.rating);
            document.querySelectorAll(".edit-rating-star").forEach(star => {
                if (Number(star.dataset.value) <= editRatingValue) {
                    star.classList.remove("bi-star");
                    star.classList.add("bi-star-fill");
                } else {
                    star.classList.remove("bi-star-fill");
                    star.classList.add("bi-star");
                }

            });
            editTitle.value = data.title 
            editDepartment.value = data.department 
            editFeedback.value = data.feedback
        }
        catch(error){
            console.log(error);
        }
    }
    else if(event.target.classList.contains('deleteFeedbackIcon')) {
        try{
            let id = event.target.dataset.id 
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to Delete this Feedback ?",
                icon: "warning",
                showCancelButton: true,
                reverseButtons: true, 
                confirmButtonColor: "#d33", 
                cancelButtonColor:"#3085d6",
                confirmButtonText: "Yes, Delete!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await fetch(`${FEEDBACKAPI}/${id}` , {
                        method:'DELETE' 
                    })

                    await filterFeedback()

                    Swal.fire({
                        title: "Deleted!",
                        text: "The Feedback has been deleted",
                        icon: "success"
                    });
                }
            });   
        }
        catch(error){
            console.log(error);
        }
        
    }
})


//Feedback Validation
function validateFeedback(title , feedback , rating , department){
    if(!title || !feedback || !rating || !department ) {
        toastr.warning('Fields cannot be empty') 
        return false 
    }
    return true 
}

//rating
let editRatingValue = 0;

const editRatingContainer = document.getElementById("editRatingContainer");

editRatingContainer.addEventListener("click", function (event) {

    if (!event.target.classList.contains("edit-rating-star")) return;

    editRatingValue = Number(event.target.dataset.value);

    document.querySelectorAll(".edit-rating-star").forEach(star => {

        if (Number(star.dataset.value) <= editRatingValue) {
            star.classList.remove("bi-star");
            star.classList.add("bi-star-fill", "text-warning");
        } else {
            star.classList.remove("bi-star-fill", "text-warning");
            star.classList.add("bi-star");
        }

    });

});


//saving edited feedback 
let saveBtn = document.getElementById('saveBtn') 
saveBtn.addEventListener('click' , async function(){
    try{
        let isValid = validateFeedback(editTitle.value , editFeedback.value , editRatingValue , editDepartment.value) 

        if(isValid) {
            let editedFeedback = {
                title:editTitle.value , 
                department:editDepartment.value , 
                rating:editRatingValue , 
                feedback:editFeedback.value , 
                updatedOn:new Date().toISOString()
            }
            toastr.success('Feedback Edited')
            await fetch(`${FEEDBACKAPI}/${currentId}` , {
                method:"PATCH" , 
                headers : {
                    'Content-type' : 'application/json'
                } , 
                body:JSON.stringify(editedFeedback)
            })
        }
        else{
            return 
        }
        await filterFeedback()



        //closing the modal 
        let modalElement = document.getElementById('editFeedbackModal') 
        let modal = bootstrap.Modal.getInstance(modalElement) 
        modal.hide()
    }
    catch(error){
        console.log(error);
    }
    
})


//pagination 

let pagination = document.querySelector('.pagination') 

let currentPage = 1 
let totalPage = 0 
const items = 10 

function createPages() {
    pagination.innerHTML = `<li class="page-item ${currentPage == 1 ? 'disabled' : ''}">
    <button href="#" class="page-link" data-type = 'previous'>Previous</button>
    </li>`

    for(let i = 1 ; i<= totalPage ; i++) {
        pagination.innerHTML += `
        <li class = 'page-item ${i == currentPage ? 'active' : ''}'>
            <button class = 'page-link' data-page = '${i}'>${i}
            </button>
        </li>`
    }
    pagination.innerHTML += `
    <li class="page-item ${currentPage == totalPage ? 'disabled' : ''}">
    <button href="#" class="page-link" data-type = 'next'>Next</button>
    </li>`
}   

function showPage(feedbacks) {
    totalPage = Math.ceil((feedbacks.length) / items ) 
    let start = (currentPage - 1) * items 
    let end = start + items 
    let currentFeedbacks = feedbacks.slice(start , end ) 
    createFeedback(currentFeedbacks) 
    createPages()
} 


pagination.addEventListener('click' , function(event){
    if(event.target.closest('.disabled')){
        return;
    }

    if(event.target.dataset.type == 'previous') {
        if(currentPage > 1) {
            currentPage --
        }
    }
    else if(event.target.dataset.type == 'next') {
        if(currentPage < totalPage) {
            currentPage ++
        }
    }
    else{
        currentPage = Number(event.target.dataset.page) 
    }
    showPage(finalFeedbacks)
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