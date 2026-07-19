import { USERSAPI , FEEDBACKAPI } from "./api.js";


//toaster
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-right",
    timeOut: 3000
};


//getting the user 
let user = JSON.parse(localStorage.getItem('user')) || ''
let currentEmail = user.email 

//loading the details 

async function loadDetails(){
    try{
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
    catch(error){
        console.log(error);
    }

}

loadDetails()





//loading values in the modal 

async function loadUserDetails(){
    let editName = document.getElementById('editName') 
    let editEmail = document.getElementById('editEmail') 
    let editPhone = document.getElementById('editPhone') 

    let userData = await fetch(`${USERSAPI}/${user.id}`) 
    let data = await userData.json() 
    editName.value = data.name 
    editEmail.value = data.email 
    editPhone.value = data.phone

}
loadUserDetails()



//saving edit 
let saveBtn = document.getElementById('saveBtn') 
saveBtn.addEventListener('click' , async function(){
    try{
        let newName = editName.value 
        let newEmail = editEmail.value 
        let newPhone = editPhone.value 


        if(!newName || !newEmail || !newPhone) {
            toastr.warning("Values Cannot be Empty!")
            return 
        }

        let nameRegex = /^[a-zA-Z ]{3,}$/ 
        let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/  
        let phoneRegex = /^\d{10}$/

        if(!nameRegex.test(newName)){
            toastr.warning('Name should only have letters and spaces') ; 
            return false ; 
        }
        if(!emailRegex.test(newEmail)){
            toastr.warning('email format is wrong') ; 
            return false ; 
        }
        if(!phoneRegex.test(newPhone) ) {
            toastr.warning('Phone number should be 10 digits ')
            return ; 
        }
        let emailsData = await fetch(`${USERSAPI}?email=${newEmail}`) 
        let duplicateEmail = await emailsData.json()  

        if(duplicateEmail.length >= 1 && duplicateEmail[0].email != currentEmail) {
            toastr.error("Email already exists") 
            return 
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
        toastr.success('profile updated successfully')
        loadDetails()

        //dismissing the modal 
        let modalElement = document.getElementById('editUserModal') 
        let modal = bootstrap.Modal.getInstance(modalElement)
        modal.hide()
    }
    catch(error){
        console.log(error);
        
    }
})


//logout
document.addEventListener('click' , function(event) {
    if(event.target.classList.contains('logoutBtn')) {
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