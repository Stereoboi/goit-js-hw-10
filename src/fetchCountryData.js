
export default function fetchCountry (searchedCountryName) {
  return fetch(`https://restcountries.com/v3.1/name/${searchedCountryName}`).then(response => {
    return response.json();
  })
}