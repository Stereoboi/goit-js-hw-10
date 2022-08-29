import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import debounce from 'lodash.debounce';
import './css/styles.css';
import countryCardTpl from '../src/templates/country.hbs'
import countryListTpl from '../src/templates/listOfCountryes.hbs'
const DEBOUNCE_DELAY = 300;


const inputRef = document.querySelector('#search-box');
const countryInfoRef = document.querySelector('.country-info');
const countryListRef = document.querySelector('.country-list');
// console.log(countryInfoRef);


inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


function onSearch(event) {
  
  if (event.target.value.trim() === '') {
    reset();
    return;
  }
  let searchQuery = inputRef.value.trim();
  fetchCountry(searchQuery).then(renderCountryCard)
}


function fetchCountry (searchedCountryName) {
  return fetch(`https://restcountries.com/v3.1/name/${searchedCountryName}`).then(response => {
    return response.json();
  })
}

function renderCountryCard(data) {
  const markupOfCard = countryCardTpl(data)
  const markupOfList = countryListTpl(data)
  const searchInfo = data.length;

  if (data.status === 404) {
    reset();
    Notiflix.Notify.failure(`Oops, there is no country with that name`);
    console.clear();
    return
  }

  if (inputRef.value.trim() === '') {
    reset();
    return;
  }
  
  if (searchInfo > 10) {
     Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
  }
  if (searchInfo >= 2 && searchInfo <= 10) {
    reset();
    countryListRef.innerHTML = markupOfList;
  }
  if (searchInfo === 1) {
    reset();
    countryInfoRef.innerHTML = markupOfCard;
  }   
}

function reset() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}
  