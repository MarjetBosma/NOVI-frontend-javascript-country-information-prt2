import axios from 'axios';

// Global variables

// Referentie weergegeven zoekresultaat:
const countryInfoContainer = document.getElementById('country-info-container');
// Referentie error message:
const errorMessageContainer = document.getElementById('error-message');
// Referenties formulier en zoekveld
const searchQueryField = document.getElementById('search-query-field');
const searchCountryForm = document.getElementById('search-country-form');

// Deze functie haalt de gevraagde gegevens op uit de API
async function fetchCountryDetails(name) {
    // Verwijdert het eventuele voorgaande zoekresultaat
    countryInfoContainer.innerHTML = '';
    // Verwijdert eventuele error message van vorige zoekopdracht
    errorMessageContainer.innerHTML = '';

    try {
        const response = await axios.get(
            `https://restcountries.com/v2/name/${name}`
        );
        const country = response.data[0]; // 1 resultaat weergeven
        console.log(country);
        showCountry(country); // Aanroepen van de functie hieronder, die de resultaten op de pagina zet
    } catch (e) {
        // Dit wordt weergegeven als de zoekopdracht niet wordt herkend
        console.error(e);
        errorMessageContainer.innerHTML = `
        <p class="error-message">Country not found, try again.</p>
        `;
    }
}

// Onderstaande functie geeft de informatie over het opgevraagde land weer op de pagina; wordt aangeroepen in try-blok hierboven, waar het country-object beschikbaar is

function showCountry({ name, flag, subregion, population, capital, currencies, languages }) {
    countryInfoContainer.innerHTML = `
<article class="search-result-container">
    <span class="flag-name-container">
        <img id="flag-image" src="${flag}" alt="Flag"/>
        <h3 id="country-name">${name}</h3>
    </span>
    <div id="country-description-container">
        <p class="country-description">${name} is situated in ${subregion}. 
        It has a population of ${population} people.</p>
        <p class="country-description">The capital is ${capital} 
        ${createCurrencyDescription(currencies)}.</p>
        <p class="country-description">${createLanguageDescription(languages)}.</p>
    </div>
</article>
`;
}

function searchCountry(e) {
    // Functie om de input uit het zoekveld te verwerken
    e.preventDefault(); // Pagina ververst hierdoor niet standaard
    // Referentie invoerveld
    fetchCountryDetails(searchQueryField.value); // Aanroepen onderstaande functie, met zoekterm als argument
    searchQueryField.value = ''; // Maakt na zoeken invoerveld weer leeg
}


function createCurrencyDescription(currencies) {
    // Zorgt voor de juiste output in de tweede <p> bij de functie showCountry, omdat currencies een array is met een of twee items.
    let output = 'and you can pay with ';

    if (currencies.length === 2) {
        // Dus als er twee currencies in de array staan
        return output + `${currencies[0].name} and ${currencies[1].name}s`;
    }
    return output + `${currencies[0].name}s`; // Als er één currency vermeld staat
}

// Bonusopdracht
function createLanguageDescription(languages) {
    // Zorgt voor de juiste output in de derde <p> bij de functie showCountry, omdat languages een array is die verschilt in lengte per land.
    let output = 'They speak ';

    for (let i = 0; i < languages.length; i++) {
        if (languages.length === 1) {
            return output += languages[i].name; // Als er maar één entry is, alleen de taal toevoegen; return statement stopt de loop dan.
        }
        if (i === languages.length - 1) {
            return output += " and " + languages[i].name; // Bij laatste entry moet er "and" voor, return statement stopt de loop dan.
        }
        if (languages.length === 2 || languages.length === 1 || i === languages.length - 2) {  // Array bevat twee entries of het betreft de een-na-laatste entry
            output += languages[i].name // Alleen de taal toevoegen
        } else {
            output += languages[i].name + ", ";  // Komma en spatie toevoegen
        }
    }
    return output
}

// Mogelijk kan bovenstaande functie korter, maar ik vond het al ingewikkeld genoeg om alle mogelijke opties te bedenken en zo uit te schrijven dat het bij allemaal correct wordt weergegeven.
// Update: Hieronder de suggestie van de reviewer. Helaas kreeg ik hiermee om een of andere reden niet de juiste output in de browser. Er stond "They speak [object Object]." Ik kreeg niet gevonden waar dit aan lag, dus toen heb ik toch mijn eigen functie weer teruggeplaatst, die wel de juiste output geeft.

// function createLanguageDescription(languages) {
//   const [lastLanguage, ...otherLanguages] = languages;
//     return `They speak ${languages.length > 1 ? `${otherLanguages.join(", ")} and ${lastLanguages}` : lastLanguage}`;
//  }

// Event listeners
searchCountryForm.addEventListener('submit', searchCountry);
