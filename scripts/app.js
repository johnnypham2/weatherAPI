
import { GetLocalStorage, RemoveFromLocalStorage, SaveToLocalStorageByCityName } from "./localstorage.js";

let apiKey = "ab969266680f13fd030ef8dec07fc23c";


let localFavorites = GetLocalStorage();
// Declaring variables:
let star = document.getElementById('star');
let locationTxt = document.getElementById('locationTxt');
let presentDate = document.getElementById('presentDate');
let searchCity = document.getElementById('searchCity');
let highTemp = document.getElementById('highTemp');
let lowTemp = document.getElementById('lowTemp');
let currentTemp = document.getElementById('currentTemp');
let currentIcon = document.getElementById('currentIcon');
let favorites = document.getElementById('favorites');
let dropdown = document.getElementById('dropdown');
let injectHere = document.getElementById('injectHere');

let day1Name = document.getElementById('day1Name');
let day1Icon = document.getElementById('day1Icon');
let day1Temp = document.getElementById('day1Temp');

let day2Name = document.getElementById('day2Name');
let day2Icon = document.getElementById('day2Icon');
let day2Temp = document.getElementById('day2Temp');

let day3Name = document.getElementById('day3Name');
let day3Icon = document.getElementById('day3Icon');
let day3Temp = document.getElementById('day3Temp');

let day4Name = document.getElementById('day4Name');
let day4Icon = document.getElementById('day4Icon');
let day4Temp = document.getElementById('day4Temp');

let day5Name = document.getElementById('day5Name');
let day5Icon = document.getElementById('day5Icon');
let day5Temp = document.getElementById('day5Temp');

let currentWeatherData;
let forecastData;
let latitude;
let longitude;


const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// fetching APIs
async function presentForecast( lat, lon) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
    const data = await promise.json();
    // console.log(data)
    return data;
}

async function forecastAPI(lat, lon){
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}&units=imperial`);
    const data = await promise.json();
    // console.log(data);
    return data; 
}

function gettingDay(dt){
    let date = new Date(dt *1000);
    return days[date.getDay()];
}

navigator.geolocation.getCurrentPosition(success, errorFunc);


async function success(position){
    console.log("Our latitude: " + position.coords.latitude);
    console.log("Our longitude: " + position.coords.longitude);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    currentWeatherData = await presentForecast(latitude, longitude);
    forecastData = await forecastAPI(latitude, longitude);
    // console.log(currentWeatherData);
    // console.log(forecastData)

    locationTxt.textContent = currentWeatherData.name;
    highTemp.textContent = Math.floor(currentWeatherData.main.temp_max);
    lowTemp.textContent = Math.floor(currentWeatherData.main.temp_min);
    currentTemp.textContent = Math.floor(currentWeatherData.main.temp);
    currentIcon.src = `http://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png`;
    
    // converting unix dt to utc 
    // getDay gives us a number from 0-6; created an array with the days corresponding to the number given
    let date = new Date(currentWeatherData.dt *1000);
    let day = days[date.getDay()];
    let month = months[date.getMonth()];
    let today = date.getDate();
    
    presentDate.textContent = `${day}, ${month} ${today}`;
    
    // 5 day forecast
    day1Name.textContent = gettingDay(forecastData.list[3].dt);
    day1Temp.textContent = Math.floor(forecastData.list[3].main.temp);
    day1Icon.src = `http://openweathermap.org/img/w/${forecastData.list[3].weather[0].icon}.png`;

    day2Name.textContent = gettingDay(forecastData.list[11].dt);
    day2Temp.textContent = Math.floor(forecastData.list[11].main.temp);
    day2Icon.src = `http://openweathermap.org/img/w/${forecastData.list[11].weather[0].icon}.png`;

    day3Name.textContent = gettingDay(forecastData.list[20].dt);
    day3Temp.textContent = Math.floor(forecastData.list[20].main.temp);
    day3Icon.src = `http://openweathermap.org/img/w/${forecastData.list[20].weather[0].icon}.png`;

    day4Name.textContent = gettingDay(forecastData.list[28].dt);
    day4Temp.textContent = Math.floor(forecastData.list[28].main.temp);
    day4Icon.src = `http://openweathermap.org/img/w/${forecastData.list[28].weather[0].icon}.png`;

    day5Name.textContent = gettingDay(forecastData.list[37].dt);
    day5Temp.textContent = Math.floor(forecastData.list[37].main.temp);
    day5Icon.src = `http://openweathermap.org/img/w/${forecastData.list[37].weather[0].icon}.png`;

    if(localFavorites.includes(locationTxt.textContent)){
        star.className = "material-symbols-outlined yellow";
    }
}

function errorFunc(error) {
    console.log(error.message)
}

// Search Event Listener and Function
searchCity.addEventListener('keydown', async function (e){
    if(e.key === 'Enter'){
            await SearchApi(e.target.value);        
    }
});

star.addEventListener("click", function(e){
    localFavorites = GetLocalStorage();
    if(localFavorites.includes(locationTxt.textContent)){
        star.className = "material-symbols-outlined";
        RemoveFromLocalStorage(locationTxt.textContent, localFavorites)
    }else{
        star.className = "material-symbols-outlined yellow";
        SaveToLocalStorageByCityName(locationTxt.textContent, localFavorites )
    }

});

dropdown.addEventListener("click", function(e){
    if(dropdown.textContent === "expand_more"){
        dropdown.textContent = "expand_less"
        for(let i = 0; i < localFavorites.length; i++){
            let p = document.createElement("p");
            p.textContent = localFavorites[i];
            p.className = "cities"
            p.addEventListener("click", async function(e){
                await SearchApi(p.textContent)
            })
            injectHere.appendChild(p);
        }
    }else{
        dropdown.textContent = "expand_more"
        injectHere.innerHTML = ""
    }
})

async function SearchApi(city) {
    try {
        const promise = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        const data = await promise.json();
        
    


    // console.log(data);
    latitude = data[0].lat;
    longitude = data[0].lon;

    currentWeatherData = await presentForecast(latitude, longitude);
    forecastData = await forecastAPI(latitude, longitude);
    console.log(currentWeatherData);
    console.log(forecastData);

    locationTxt.textContent = `${currentWeatherData.name}, ${currentWeatherData.sys.country}`;
    highTemp.textContent = Math.floor(currentWeatherData.main.temp_max);
    lowTemp.textContent = Math.floor(currentWeatherData.main.temp_min);
    currentTemp.textContent = Math.floor(currentWeatherData.main.temp);
    currentIcon.src = `http://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png`;
    
    // converting unix dt to utc 
    // getDay gives us a number from 0-6; created an array with the days corresponding to the number given
    let date = new Date(currentWeatherData.dt *1000);
    let day = days[date.getDay()];
    let month = months[date.getMonth()];
    let today = date.getDate();
    
    presentDate.textContent = `${day}, ${month} ${today}`;
    
    // 5 day forecast
    day1Name.textContent = gettingDay(forecastData.list[3].dt);
    day1Temp.textContent = Math.floor(forecastData.list[3].main.temp);
    day1Icon.src = `http://openweathermap.org/img/w/${forecastData.list[3].weather[0].icon}.png`;

    day2Name.textContent = gettingDay(forecastData.list[11].dt);
    day2Temp.textContent = Math.floor(forecastData.list[11].main.temp);
    day2Icon.src = `http://openweathermap.org/img/w/${forecastData.list[11].weather[0].icon}.png`;

    day3Name.textContent = gettingDay(forecastData.list[20].dt);
    day3Temp.textContent = Math.floor(forecastData.list[20].main.temp);
    day3Icon.src = `http://openweathermap.org/img/w/${forecastData.list[20].weather[0].icon}.png`;

    day4Name.textContent = gettingDay(forecastData.list[28].dt);
    day4Temp.textContent = Math.floor(forecastData.list[28].main.temp);
    day4Icon.src = `http://openweathermap.org/img/w/${forecastData.list[28].weather[0].icon}.png`;

    day5Name.textContent = gettingDay(forecastData.list[37].dt);
    day5Temp.textContent = Math.floor(forecastData.list[37].main.temp);
    day5Icon.src = `http://openweathermap.org/img/w/${forecastData.list[37].weather[0].icon}.png`;
    if(localFavorites.includes(locationTxt.textContent)){
        star.className = "material-symbols-outlined yellow";
    }else{
        star.className = "material-symbols-outlined";

    }
} catch (error) {
    alert("Please enter in a valid city")
}
}

