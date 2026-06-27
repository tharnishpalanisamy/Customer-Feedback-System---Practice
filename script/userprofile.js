import { USERSAPI , FEEDBACKAPI } from "./api.js";


//getting the user 
let user = JSON.parse(localStorage.getItem('user')) || ''
//loading the details 

async function loadDetails(){
    let userData = await fetch(`${USERSAPI}/${user.id}`)
    let currentUser = await userData.json()
    document.querySelector('.userName').innerText = currentUser.name 
    document.querySelector('.role').innerText = currentUser.role 
    document.querySelector('.userRole').innerText = currentUser.role 
    document.querySelector('.fullName').innerText = currentUser.name 
    document.querySelector('.email').innerText = currentUser.email 
    document.querySelector('.phone').innerText = `${currentUser.phone ? `+91 ${currentUser.phone}` : 'NA'}`
    let date = new Date(currentUser.createdOn)
    document.querySelector('.joinedDate').innerText = ` ${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}
    `
    document.querySelector('.userStatus').innerText = currentUser.status 

}

loadDetails()


//loading the statistics 

async function fetchStatistics(){
    let feedbackData = await fetch(`${FEEDBACKAPI}?userId=${user.id}`)
    let feedbacks = await feedbackData.json() 
    let rating = 0 
    let pending = 0 
    let responded = 0 

    feedbacks.forEach(feedback => {
        rating += Number(feedback.rating)
        if(feedback.status == 'Pending') {
            pending ++
        }
        else if(feedback.status == 'Responded') {
            responded ++
        }
    })

    document.querySelector('.totalFeedback').innerText = feedbacks.length 
    document.querySelector('.averageRating').innerHTML = `${(rating /feedbacks.length).toFixed(1)} <i class="bi bi-star-fill text-warning"></i>`
    document.querySelector('.pending').innerText = pending 
    document.querySelector('.responded').innerText = responded

}

fetchStatistics()


//loading values in the modal 

let editName = document.getElementById('editName') 
let editEmail = document.getElementById('editEmail') 
let editPhone = document.getElementById('editPhone') 

editName.value = user.name 
editEmail.value = user.email 
editPhone.value = user.phone



//saving edit 
let saveBtn = document.getElementById('saveBtn') 
saveBtn.addEventListener('click' , async function(){
    let newName = editName.value 
    let newEmail = editEmail.value 
    let newPhone = editPhone.value 


    if(!newName || !newEmail || !newPhone) {
        alert("VALUES CANNOT BE EMPTY")
        return 
    }

    let nameRegex = /^[a-zA-Z ]{3,}$/ 
    let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/  
    let phoneRegex = /^\d{10}$/

    if(!nameRegex.test(newName)){
        alert('Name should only have letters and spaces') ; 
        return false ; 
    }
    if(!emailRegex.test(newEmail)){
        alert('email format is wrong') ; 
        return false ; 
    }
    if(!phoneRegex.test(newPhone) ) {
        alert('Phone number should be 10 digits ')
        return ; 
    }



    await fetch(`${USERSAPI}/${user.id}` , {
        method:"PATCH" , 
        headers : {
            'Content-type' : 'application/json'
        } , 
        body: JSON.stringify({
            name : newName , 
            email : newEmail , 
            phone : newPhone 
        })

    })

    loadDetails()







    //dismissing the modal 
    let modalElement = document.getElementById('editUserModal') 
    let modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide()
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
