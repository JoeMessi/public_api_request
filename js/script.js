
// selects the div where we'll show the people's profiles
const gallery = document.getElementById('gallery');

// will store the array of data fetched (references for the modal window)
//let arrPeople = [];



// fetching from the API
fetch('https://randomuser.me/api/?results=12')
 .then(checkStatus)
 .then(res => res.json())
 .then(data => {
    displayPeople(data.results);
    // arrPeople = JSON.parse(JSON.stringify(data.results));  // cloning data fethed into the 'arrPeople' array
 })
 .catch(err => console.log('Something went wrong', err));



 // this will check for HTTP request status error
 function checkStatus(response) {
   if(response.ok){
     return Promise.resolve(response);
   }else{
     return Promise.reject(new Error(response.statusText));
   }
 }


// function that display the people's profiles in the page
const displayPeople = (data) => {
  const people = data.map(person =>
    `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
    </div>
    `
  ).join('');
  gallery.innerHTML = people;
}




// gallery.addEventListener('click', (e) => {
//
//   if(e.target.tagName  === 'DIV'){
//      console.log(e.target);
//   }
//
// });





// function findByName(person){
//   return person.name.first === 'zara';
// }
//
// console.log(arrPeople.find(findByName));
//
//
//
//
 //setTimeout(x, 1000)



















// ----
