// Declare universal variables
const db = 'http://localhost:3000/dogs';
let currentDog;

// Set DOM interaction variables
const dogTable = document.getElementById('table-body');
const dogForm = document.getElementById('dog-form');
const nameField = document.getElementById('nameField');
const breedField = document.getElementById('breedField');
const sexField = document.getElementById('sexField');

// Add listeners
dogForm.addEventListener('submit', e => updateDog(e));

// Fetch dogs
function fetchDogs() {
  fetch(db)
  .then(resp => resp.json())
  .then(json => buildDogTable(json))
}

// Handle update dog button
function updateDog(e) {
  e.preventDefault();
  const newName = e.target.name.value;
  const newBreed = e.target.breed.value;
  const newSex = e.target.sex.value;
  fetch(`${db}/${currentDog}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: newName,
      breed: newBreed,
      sex: newSex,
    }),
  })
  .then(fetchDogs());
  dogForm.reset();
  currentDog = null;
}

// Handle edit dog buttons
function editDog(e) {
  e.preventDefault();
  currentDog = e.target.id;
  fetch(`${db}/${currentDog}`)
  .then(resp => resp.json())
  .then(json => populateForm(json)); 
}

// Build the table from an updated fetch
function buildDogTable(dogs) {
  dogTable.replaceChildren();
  for (dog of dogs) {
    let row = document.createElement('tr');
    let name = document.createElement('td');
    name.textContent = dog.name;
    let breed = document.createElement('td');
    breed.textContent = dog.breed;
    let sex = document.createElement('td');
    sex.textContent = dog.sex;
    let edit = document.createElement('td');
    let button = document.createElement('button');
    button.textContent = 'Edit Dog';
    button.id = dog.id;
    button.addEventListener('click', e => editDog(e));
    edit.appendChild(button);
    row.appendChild(name);
    row.appendChild(breed);
    row.appendChild(sex);
    row.appendChild(edit);
    dogTable.appendChild(row);
  }
}

// Populate form with existing dog information
function populateForm(dog) {
  dogForm.name.value = dog.name;
  dogForm.breed.value = dog.breed;
  dogForm.sex.value = dog.sex;
}

// Initialize
fetchDogs();