//Get data from Form and load to Firestore
const form = document.querySelector('form');
const iname = document.querySelector('#name');
const icost = document.querySelector('#cost');
const ierror = document.querySelector('#error');

//Add event listener for a Submit event
form.addEventListener('submit', (e) =>{
    /* We need to prevent the default dehavior for the submit event
      The default behavior is to refresh the page when you click submit */
    e.preventDefault();

    //See if the input fields have value and then prcess
    if(iname.value && icost.value){

        const item = {
            name: iname.value,
            cost: parseInt(icost.value)
        };

        console.log("in if loop");

        db.collection('expenses').add(item).then(res => {
            iname.value = "";
            icost.value = "";
            ierror.textContent = "";
        });

    } else {
        ierror.textContent = 'Please enter values before submitting'
    }

})