import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import debounce from 'lodash.debounce';
import './css/styles.css';
const DEBOUNCE_DELAY = 300;
import fetchCountry from '../src/fetchCountryData'
const inputRef = document.querySelector('#search-box');
const countryInfoRef = document.querySelector('.country-info');
const countryListRef = document.querySelector('.country-list');


inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  
  if (event.target.value.trim() === '') {
    reset();
    return;
  }
  let searchQuery = inputRef.value.trim();
  fetchCountry(searchQuery).then(renderCountryCard)
}


function renderCountryCard(data) {
  // const markupOfCard = countryCardTpl(data)
  let searchInfo = data.length;

  if (data.status === 404) {
    reset();
    Notiflix.Notify.failure(`Oops, there is no country with that name`);
    console.clear();
    return
  }
  
  if (searchInfo >= 10) {
    Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
    return;
  }
    // const markupOfList = countryListTpl(data)
  
    if (searchInfo >= 2 && searchInfo <= 10) {
    reset();
    fewMatchesRender(data)
  }
    if (searchInfo === 1) {
    reset();
    singleMatchRender(data)
  }
}

function singleMatchRender(data) {
  console.log(data);
  const countryCardTpl = data.map(
    ({ flags, name, capital, languages, population, coatOfArms }) => {
      const language = Object.values(languages).join(', ');
      return `
      <div class="country_card--wrapper" >
      <ul class="country_descr">
        <li class="country_item country_item--main ">
            <img src="${flags.svg}" alt="${name}" class="country__flag" width="600">
            <h1 class="country__title">${name.common}</h1>
        </li>
        <li class="country_item">
            <p class="country__text">Capital:<span class="text">${capital}</span></p>
        </li>
        <li class="country_item">
            <p class="country__text">Population:<span class="text">${population}</span></p>
        </li>
        <li class="country_item">
            <p class="country__text">Languages:<span class="text">${language}</span> </p>
        </li>
        </ul>
        <img src="${coatOfArms.svg}" alt="${name}" class="country__coat" width="600">
      </div>`;
    }
  );
  countryInfoRef.innerHTML = countryCardTpl;
}

function fewMatchesRender(data) {
  const countryListTpl = data.map(({ flags, name }) => {
      return `
        <li class="countries__item--list">
          <img src="${flags.svg}" alt="${name.common}" class="countries__flag--list">
          <p class="text countries__name">${name.common}</p>
        </li>
    `;
    })
    .join('');
  countryListRef.innerHTML = countryListTpl;
}


function reset() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}
  