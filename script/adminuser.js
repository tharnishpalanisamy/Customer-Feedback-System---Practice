import {USERSAPI} from './api.js'


//filtering logic 
let roleFilter = document.getElementById('roleFilter') 
let statusFilter = document.getElementById('statusFilter') 
let searchName = document.getElementById('searchName')

async function filterusers(){
    let usersData = await fetch(USERSAPI)
    let users = await usersData.json()

    if(roleFilter.value != 'All') {
        users = users.filter(user=>user.role == roleFilter.value ) 
    }

    if(statusFilter.value != 'All') {
        users = users.filter(user=>user.status == statusFilter.value )
    }

    if(searchName.value != '') {
        users = users.filter(user => user.name.toLowerCase().includes(searchName.value))
    }

    createuser(users)
}

roleFilter.addEventListener('click' , filterusers) 
statusFilter.addEventListener('click' , filterusers) 
searchName.addEventListener('input' , filterusers)
















//creating user 

function createuser(users){
    let table = document.querySelector('.table') 
    let body = table.querySelector('tbody') 
    body.innerHTML = "" 
    if (users.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-5 text-secondary">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    No user found.
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach((user,index) =>{
        let createdDate = new Date(user.createdOn) 
        body.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td class = '${user.role}'>${user.role}</td>
            <td>${createdDate.getDate()}-${createdDate.getMonth()}-${createdDate.getFullYear()}</td>
            <td class = '${user.status}-bg text'>${user.status}</td>
            <td class='text-center'>
            <i class="bi bi-pencil-square fs-5 ${user.status == 'Active'?'active editBtn':'blocked'}" 
            ${user.status == 'Active'? `
                data-bs-toggle="modal" data-bs-target="#editUserModal" data-id =${user.id} title = 'Edit'`
                :''}></i>
                ${user.status == 'Active'?`<i class="bi bi-trash3-fill text-danger fs-5 ms-3 deleteBtn" data-id =${user.id} ></i>`
                    :`<i class="bi bi-arrow-counterclockwise ms-3 fs-5 text-success restoreBtn" data-id =${user.id}></i>`}</td>  
        </tr>
        `
    })
}

async function displayuser(){
    let usersData = await fetch(USERSAPI)
    let users = await usersData.json() 
    createuser(users)
}
displayuser()



//edit modal elements
let name = document.getElementById('name')
let email = document.getElementById('email')
let role = document.getElementById('role')



//user edit option 
let currentUser ; 
//loading values in the modal , delete and restore 
document.addEventListener('click' , async function(event){
    if(event.target.classList.contains('editBtn')){
        currentUser = event.target.dataset.id
        let userData = await fetch(`${USERSAPI}/${currentUser}`) 
        let user = await userData.json() 

        console.log(user);
        
        name.value = user.name 
        email.value = user.email 
        role.value = user.role 
    }

    else if(event.target.classList.contains('deleteBtn')) {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Deactivate this User ?",
            icon: "warning",
            showCancelButton: true,
            reverseButtons: true, // Confirm button moves to the right
            confirmButtonColor: "#d33", 
            cancelButtonColor:"#3085d6",
            confirmButtonText: "Yes, Deactivate!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                currentUser = event.target.dataset.id 
                //set user as in active 

                await fetch(`${USERSAPI}/${currentUser}` , {
                    method:'PATCH' , 
                    headers : {
                        'Content-type' : 'application/json'
                    } , 
                    body:JSON.stringify({
                        status:'In Active'
                    })
                })

                filterusers()

                Swal.fire({
                    title: "Deactivated!",
                    text: "The user has been Deactivated.",
                    icon: "success"
                });
            }
        });        
    }

    else if(event.target.classList.contains('restoreBtn')) {
        currentUser = event.target.dataset.id 
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Activate this User ?",
            icon: "warning",
            showCancelButton: true,
            reverseButtons: true, // Confirm button moves to the right
            confirmButtonColor: "#0ed554",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Activate!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                currentUser = event.target.dataset.id 
                //set user as active 

                await fetch(`${USERSAPI}/${currentUser}` , {
                    method:'PATCH' , 
                    headers : {
                        'Content-type' : 'application/json'
                    } , 
                    body:JSON.stringify({
                        status:'Active'
                    })
                })

                filterusers()

                Swal.fire({
                    title: "Activated!",
                    text: "The user has been Activated.",
                    icon: "success"
                });
            }
        }); 
    }


})

//saving changes
let saveBtn = document.getElementById('saveBtn') 
saveBtn.addEventListener('click' , async function(){

    if(!name.value || !email.value) {
        alert('Enter the Values correctly') 
        return ;
    }

    let nameRegex = /^[a-zA-Z ]{3,}$/ 
    let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/  

    if(!nameRegex.test(name.value)){
        alert('Name should only have letters and spaces') ; 
        return false ; 
    }
    if(!emailRegex.test(email.value)){
        alert('email format is wrong') ; 
        return false ; 
    }

    let editedUser = {
        name : name.value , 
        email : email.value , 
        role : role.value 
    }

    await fetch(`${USERSAPI}/${currentUser}` , {
        method:'PATCH' , 
        headers:{
            'Content-type' : 'application/json'
        } , 
        body:JSON.stringify(editedUser)
    })

    filterusers()

    //closing the modal
    let modalElement = document.getElementById('editUserModal') 
    let modal = bootstrap.Modal.getInstance(modalElement) 
    modal.hide()
})