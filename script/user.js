import { USERSAPI , FEEDBACKAPI } from './api.js';


//getting the user 
let user = JSON.parse(localStorage.getItem('user')) || '' 
if(!user) {
    alert('Please login first') 
    window.location.href('../index.html')
}

console.log(user.name);
console.log(user.id);


//adding feeback 

//validating feedback 

function validateFeedback(title , feedback , rating){
    if(!title || !feedback || !rating ) {
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
    let valid = validateFeedback(title.value , feedback.value , rating.value)
    if(valid) {
        let feebackData = { 
            userId:user.id,
            username:user.name,
            email:user.email,
            title:title.value , 
            feedback:feedback.value , 
            rating : rating.value , 
            createdOn : new Date().toISOString() , 
            active:1 , 
            remarks:""
        }

        await fetch(`${FEEDBACKAPI}` , {
            method:"POST" , 
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(feebackData)
        })
    }


    //closing the modal 
    title.value = '' 
    feedback.value = '' 
    rating.value = ''
    let modalElement = document.getElementById('feedbackModal') 
    let modal = bootstrap.Modal.getInstance(modalElement) 
    modal.hide()

})