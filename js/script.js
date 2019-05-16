
// selects the div that will contain the cards profiles
const gallery = document.getElementById('gallery');
// cards html collection
const cards = gallery.children;
// selects the div that contains the search form
const searchDiv = document.querySelector('.search-container');
// array of objects that will contain only the data we're interested in about the profiles fetched from the api,
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


fetch('https://randomuser.me/api/?results=12&nat=gb') // fetching from the API
  .then(checkStatus) // checkStatus checks for http request errors
  .then(res => res.json()) // decoding the json http response
  .then(data => {
     pushInfo(data.results); // pushInfo populates 'peopleArray' with the info we want from the data fetched
     displayPeople(peopleArray); // display people's cards on page
     appendModal(); // shows modal window of the person's card clicked
  })
 .catch(err => console.log('Something went wrong', err)); // if any errors they will be logged to the console


 // given the response from the HTTP request, this will check for status error
 function checkStatus(response) {
   if(response.ok){
     return Promise.resolve(response);
   }else{
     return Promise.reject(new Error(response.statusText));
   }
 }


 // this push all the info we need about each profile into the array 'peopleArray'
 // we loop through all profiles, for every loop an object is created and pushed into the array
 // 'peopleArray' will be an array of profiles objects
 // the argument for the 'data' parameter will be the data we get from the http request
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


// function that display people's cards on the page
// the argument of the 'data' parameter will be the array of objects
// we created from the data fetched from the api (peopleArray)
function displayPeople(data)  {
  const people = data.map((person, index) =>
     `
     <div class="card" name='${person.first_name}_${person.last_name}' id='index${index}'>
         <div class="card-img-container">
             <img class="card-img" src="${person.image}" alt="profile picture">
         </div>
         <div class="card-info-container">
             <h3 id="name" class="card-name cap">${person.first_name} ${person.last_name}</h3>
             <p class="card-text">${person.email}</p>
             <p class="card-text cap">${person.city}, ${person.state}</p>
         </div>
     </div>
     `
  ).join('');
  gallery.innerHTML = people;
}


// displays a modal window of the person's card clicked
function appendModal() {

  // looping through all cards I assign a 'click' event listener to all of them
  for(let i = 0; i < cards.length; i++) {

    cards[i].addEventListener('click', () => {
    // card id number, equivalent to the index of that person in the array 'peopleArray'
    const personIndex = cards[i].id.substr(5);

    // looking for a match between the card id number just clicked
    // and its equivalent index in 'peopleArray'
    for(person of peopleArray) {
      if(peopleArray.indexOf(person) === parseInt(personIndex)) {

        // we call 'modalTemplate' on the matched person
        // this function will create and display the modal window
        modalTemplate(person);
        // we set our counter variable to the matched person index
        index = peopleArray.indexOf(person);

        // if first person on the list => hide 'PREV' button from the modal window
        if(index === 0) {
          document.querySelector('#modal-prev').style.display = 'none';
        }
        // if last person on the list => hide 'NEXT' button from the modal window
        if(index === peopleArray.length-1) {
          document.querySelector('#modal-next').style.display = 'none';
        }
      }
    }
    }); // end click
  } // end loop
}; // end modalWindow


// given a person object as argument, it creates and appends a modal window to the page
function modalTemplate(person) {
  const outerDiv = document.createElement('div');
  outerDiv.className = 'modal-container';
  const html = `
        <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${person.image}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${person.first_name} ${person.last_name}</h3>
              <p class="modal-text email">${person.email}</p>
              <p class="modal-text cap city">${person.city}</p>
              <hr>
              <p class="modal-text cell">${person.cell_num}</p>
              <p class="modal-text address">${person.address}, ${person.state}, ${person.postcode}</p>
              <p class="modal-text birthday">Birthday: ${person.birthday.slice(0,10)}</p>
          </div>
       </div>
       <div class="modal-btn-container">
           <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
           <button type="button" id="modal-next" class="modal-next btn">Next</button>
       </div>
  `;
   outerDiv.innerHTML = html;
   gallery.insertAdjacentElement('afterend', outerDiv);

   // button that closes/removes the modal window
   const button = document.querySelector('#modal-close-btn');
   button.addEventListener('click', () => {
     outerDiv.remove();
   })

} // end modalTemplate


// 'click' event listener on the document to check when the 'PREV' and 'NEXT' buttons
// of the card modal window are clicked.
// using the 'index' counter variable as a reference for the current person's index displaying on the page
// we can call 'modalTemplate' on either the next or previous person's object in 'peopleArray'

document.addEventListener('click', (event) => {

  if(event.target.id === 'modal-prev') {
    if(index > 0) {
      // removes current modal
      document.querySelector('.modal-container').remove();
      // add new one
      modalTemplate(peopleArray[index - 1]);
      //update index
      index -= 1;
      // if first person on the list => hide 'PREV' button from the modal window
      if(index === 0) {
        document.querySelector('#modal-prev').style.display = 'none';
      }

    }
  }

  if(event.target.id === 'modal-next') {
    if(index < peopleArray.length-1) {
      // removes current modal
      document.querySelector('.modal-container').remove();
      // add new one
      modalTemplate(peopleArray[index + 1]);
      //update index
      index += 1;
      // if last person on the list => hide 'NEXT' button from the modal window
      if(index === peopleArray.length-1) {
        document.querySelector('#modal-next').style.display = 'none';
      }

    }
  }
});


// ----- search form ------

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
