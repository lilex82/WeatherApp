const api = {
  key: "25396e0a83bbff5df47bd97faee582aa",
  base: "https://api.openweathermap.org/data/2.5/",
  lang: "eng",
  units: "metric"
}
// search box and button
const search = document.querySelector('.search-box');
const search_button = document.querySelector('.btn');
// location
const city = document.querySelector('.city');
const date = document.querySelector('.date');
// current_temperature

const current_temperature = document.querySelector('.current-temperature');
const temp_number = document.querySelector('.temperature div');
const temp_unit = document.querySelector('.temperature span');
const weather_t = document.querySelector('.summary');
const container_image = document.querySelector('.container-image');
//current stats
const low_high = document.querySelector('.low-high');
const wind_speed = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')

window.addEventListener('load', () => {
  //if ("geolocation" in navigator)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  }
  else {
    alert('Geolocation not supported');
  }
  function setPosition(position) {
    console.log(position)
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    coordResults(lat, long);
  }
  function showError(error) {
    alert(`erro: ${error.message}`);
  }
})

function coordResults(lat, long) {
  fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`http error: status ${response.status}`)
      }
      return response.json();
    })
    .catch(error => {
      alert(error.message)
    })
    .then(response => {
      displayResults(response)
    });
}

search_button.addEventListener('click', function () {
  searchResults(search.value)
})

search.addEventListener('keypress', enter)
function enter(event) {
  key = event.keyCode
  if (key === 13) {
    searchResults(search.value)
  }
}

function searchResults(city) {
  fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
    .then(resolucao => resolucao.json())
    .then((body) => displayResults(body))
    .catch(error => alert(error.message))
}

function displayResults(weather) {
  console.log(weather)

  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  date.innerText = dateBuilder(now);

  let iconName = weather.weather[0].icon;
  container_image.innerHTML = `<img src="./Public/images/${iconName}.png" alt="">`;

  let temperature = `${Math.round(weather.main.temp)}`
  temp_number.innerHTML = temperature;
  temp_unit.innerHTML = `°c`;

  weather_tempo = weather.weather[0].description;
  weather_t.innerText = capitalizeFirstLetter(weather_tempo)

  low_high.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  wind_speed.innerHTML = `${Math.round(weather.wind.speed)} km/h`;

  humidity.innerHTML = `${Math.round(weather.main.humidity)}%`;



}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()]; //getDay: 0-6
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

current_temperature.addEventListener('click', changeTemp)
function changeTemp() {
  temp_number_now = temp_number.innerHTML

  if (temp_unit.innerHTML === "°c") {
    let f = (temp_number_now * 1.8) + 32
    temp_unit.innerHTML = "°f"
    temp_number.innerHTML = Math.round(f)
  }
  else {
    let c = (temp_number_now - 32) / 1.8
    temp_unit.innerHTML = "°c"
    temp_number.innerHTML = Math.round(c)
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}