
// selects the div that contains the search form
const searchDiv = document.querySelector('.search-container');

const html = `
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
`;

searchDiv.innerHTML = html;






// selects the div where we'll show the people's profiles
const gallery = document.getElementById('gallery');
// cards html collection
const cards = gallery.children;

// will store the array of data fetched (references for the modal window)
//let arrPeople = [];



// fetching from the API
fetch('https://randomuser.me/api/?results=12&nat=gb')
 .then(checkStatus)
 .then(res => res.json())
 .then(data => {
    // display people on page
    displayPeople(data.results);
    // array of people
    pushToObj(data.results);
    // ----
    appendModal();
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
  const people = data.map((person, index) =>
    `
    <div class="card" id='${person.name.first}_${person.name.last}'>
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



const arr = [];

function pushToObj(data) {
  data.forEach((item) => {
    const obj = {};
    obj[item.name.first+'_'+item.name.last] = {
      image: item.picture.large,
      first_name: item.name.first ,
      last_name: item.name.last ,
      email: item.email ,
      cell_num: item.phone,
      city: item.location.city,
      state: item.location.state,
      address: item.location.street,
      postcode: item.location.postcode,
      birthday: item.dob.date // make it shorter (only date)
       }
      arr.push(obj);
  })
  //console.log(arr);
}




// append modal window of person when card clicked
function appendModal() {

// click event on all cards
for(let i = 0; i < cards.length; i++) {
  cards[i].addEventListener('click', () => {
    // id of the clicked card person
    const id_name = cards[i].id;

    for(person of arr) {
      // looks for the match
      if(person.hasOwnProperty(id_name)) {
        // call modalTemplate on the matched person
        modalTemplate(person[id_name]);
      }
    }
  }); // end click
} // end loop
} // end modalWindow / no need for a function here, i think, this is kinda of a function for the delay



// create and append the temmplate of the modal window
function modalTemplate(person) {
  const outerDiv = document.createElement('div');
  outerDiv.className = 'modal-container';
  const html = `
        <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${person.image}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${person.first_name} ${person.last_name}</h3>
              <p class="modal-text">${person.email}</p>
              <p class="modal-text cap">${person.city}</p>
              <hr>
              <p class="modal-text">${person.cell_num}</p>
              <p class="modal-text">${person.address}, ${person.state}, ${person.postcode}</p>
              <p class="modal-text">Birthday: ${person.birthday.slice(0,10)}</p>
         </div>
  `;
   outerDiv.innerHTML = html;
   gallery.insertAdjacentElement('afterend', outerDiv);

   // button X
   const button = document.querySelector('#modal-close-btn');
   button.addEventListener('click', () => {
     outerDiv.remove();
   })
}




// ----- form ------

// seletcs the form
const form = document.getElementsByTagName('form')[0];
// selects the search field of the form
const searchField = document.querySelector('#search-input');
// selects the submit input
const submit = document.querySelector('#serach-submit');

// function that hides/shows cards that match the search input value
function showHide() {
  for(card of cards) {
    if(card.id.includes(searchField.value.toLowerCase())) {
      card.style.display = '';
    }else{
      card.style.display = 'none';
    }
  }
};

// submit event on the sumbit input
form.addEventListener('submit', (event) => {
 event.preventDefault();
 showHide();
});

// keyup event on the search input
searchField.addEventListener('keyup', () => {
 showHide();
});













// ----
