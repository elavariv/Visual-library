//select all buttons - hence use querySelectorAll method
const btns= document.querySelectorAll('button');

//Select the span inside the form. We will insert the activity on this span
const form = document.querySelector('form');
const formAct = document.querySelector('form span');

//Select the user input field. Assumption is only one input field exists. For many input field, use a unique ID
const input = document.querySelector('input')

//Select the error message field
const error = document.querySelector(".error")

//Handle click on buttons
var activity = 'cycling'; //default activity
btns.forEach(btn => {
    btn.addEventListener('click', e=>{
        //when user clicks, get the activity name and update the default activity
        activity = e.target.dataset.activity; 
        // data-* is a standard attribute. check https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        
        //Set the current button active by adding the "active" class to this element
        //First remove the active class from all other buttons
        btns.forEach(btn=>btn.classList.remove('active'));
        //Add active class to the current button
        e.target.classList.add('active');

        //set ID of the input field
        input.setAttribute('id', activity);

        //set text of form span
        formAct.textContent = activity;

        //Generate graph everytime a user clicks on the button
        update(data);

    })
})

//Get user input and pass it to Firestore
form.addEventListener('submit', e => {
    //prevent reloading of page when you submit
    e.preventDefault();

    const distance = parseInt(input.value)
    if(distance){
        db.collection('activities').add({
            distance: distance,
            activity: activity,
            date: new Date().toString()
        }).then(() => {
            error.textContent = `Last entry added for activity ${activity} is ${distance} m`;
            input.value = '';
        }) 
        } else {
            error.textContent = "please enter the distance"
    }
})