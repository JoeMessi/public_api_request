
// selects the div where we'll show people's profiles
const gallery = document.getElementById('gallery');

// cards html collection
const cards = gallery.children;

// selects the div that contains the search form
const searchDiv = document.querySelector('.search-container');

// array of objects that will hold the data we're interested about the profiles fetched from the api
// each object represent a profile
const peopleArray = [];

// counter variable used in the logic for displaying previous and next modal window
let index;

// form markup in a template literal
const html = `
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
`;

// adding the form markup to the page
searchDiv.innerHTML = html;


// fetching from the API
fetch('https://randomuser.me/api/?results=12&nat=gb')
  .then(checkStatus)  // checkStatus checks for http request errors
  .then(res => res.json())  // decoding the json http response
  .then(data => {
    // display people on page
    displayPeople(data.results);
    // peopleArrayay of people
    pushInfo(data.results);
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
    <div class="card" name='${person.name.first}_${person.name.last}' id='index${index}'>
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




// this push all the info we need about each profile into the array 'peopleArray'
function pushInfo(data) {
  data.forEach((item) => {
     const obj = {
       image: item.picture.large,
       first_name: item.name.first ,
       last_name: item.name.last ,
       email: item.email ,
       cell_num: item.phone,
       city: item.location.city,
       state: item.location.state,
       address: item.location.street,
       postcode: item.location.postcode,
       birthday: item.dob.date
     }
  peopleArray.push(obj);
  })
}




// append modal window of person when card clicked
function appendModal() {

// click event on all cards
for(let i = 0; i < cards.length; i++) {
  cards[i].addEventListener('click', () => {
    // id of the clicked card person
    const personIndex = cards[i].id.substr(5);

    for(person of peopleArray) {
      // looks for the match
      if(peopleArray.indexOf(person) === parseInt(personIndex)) {

        index = peopleArray.indexOf(person);

        // call modalTemplate on the matched person
        modalTemplate(person);
      }
    }
  }); // end click
} // end loop
} // end modalWindow



  //PREV and NEXT card modal window

  document.addEventListener('click', (event) => {
    if(event.target.id === 'modal-prev') {
      if(index > 0) {
      // removes current modal
      document.querySelector('.modal-container').remove();
      // add new one
      modalTemplate(peopleArray[index - 1]);
      //update index
      index -= 1;
      }
    }
  });

  document.addEventListener('click', (event) => {
    if(event.target.id === 'modal-next') {
      if(index < peopleArray.length-1) {
      // removes current modal
      document.querySelector('.modal-container').remove();
      // add new one
      modalTemplate(peopleArray[index + 1]);
      //update index
      index += 1;
      }
    }
  });




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
       </div>
       <div class="modal-btn-container">
           <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
           <button type="button" id="modal-next" class="modal-next btn">Next</button>
       </div>
  `;
   outerDiv.innerHTML = html;
   gallery.insertAdjacentElement('afterend', outerDiv);

   // button X
   const button = document.querySelector('#modal-close-btn');
   button.addEventListener('click', () => {
     outerDiv.remove();
   })

} // end modalTemplate





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
    const name = card.getAttribute('name');

    if(name.includes(searchField.value.toLowerCase())) {
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
