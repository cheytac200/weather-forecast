
const apiKey = '39b4e6d096cbafd2fc03fa861c34f238';
// const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall?';

const geoCodingUrl = 'http://api.openweathermap.org/geo/1.0/direct?';
const geoReverseUrl = 'http://api.openweathermap.org/geo/1.0/reverse?';
// https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,minutely&appid=39b4e6d096cbafd2fc03fa861c34f238&units=metric

const searchValue = document.getElementById('searchCity');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currLocation = document.querySelector('.location');


const getCoordinates = async (city) => {
    try {
        const response = await axios.get(geoCodingUrl + `q=${city}` + `&appid=${apiKey}`)

        if (!response.data[0]) {
            //enter correct city!
        }

        return { lat: response.data[0].lat, lon: response.data[0].lon, loc: response.data[0].name}
    } catch (err) {
        console.error(err)
    }
}

const getCity = async (lat, lon)=> {
    try {
        const response = await axios.get(geoReverseUrl + `lat=${lat}&lon=${lon}&appid=${apiKey}`)
        return response.data[0].name;
    } catch (err) {
        console.error(err)
    }
}

const displayData = (data) => {
    for (let i = 0; i < 5; i++) { ///forEach
        new WeatherCard(data.daily[i], i);
    }
}

const getWeather = async (city) => {
    try {
        const coordinates = await getCoordinates(city);
        const { lat, lon, loc } = coordinates;
        const response = await axios.get(baseUrl + `lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

        currLocation.innerHTML = loc;

        displayData(response.data)

        console.log(response.data)
    } catch (error) {
        console.error(error);
    }
}
function getWeatherCurrentLocation(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    axios.get(baseUrl + `lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`).then(response => {
        getCity(lat, lon).then(city => {
            currLocation.innerHTML = city;
        })
        displayData(response.data)
    });

}


searchBtn.addEventListener('click', () => {
    getWeather(searchValue.value);
    searchValue.value = '';
})

locationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(getWeatherCurrentLocation)
})

const cards = document.querySelectorAll(".card");///SLIDER

cards.forEach(element => element.addEventListener("click", () => {
    RemoveClassActive();
    element.classList.add("active");
}));

const RemoveClassActive = () => {
    cards.forEach(element => element.classList.remove("active"));
}

const getIcon = (codeIcon) => {
    let img;
    switch (codeIcon) {
        case '01d':
            img = `<img src='img/wsymbol_0001_sunny.svg' alt=""/>`;
            break;
        case '02d':
            img = `<img src='img/wsymbol_0002_sunny_intervals.svg' alt=""/>`;
            break;
        case '03d':
            img = `<img src='img/wsymbol_0003_white_cloud.svg' alt=""/>`;
            break;
        case '04d':
            img = `<img src='img/wsymbol_0004_black_low_cloud.svg' alt=""/>`;
            break;
        case '09d':
            img = `<img src='img/wsymbol_0018_cloudy_with_heavy_rain.svg' alt=""/>`;
            break;
        case '10d':
            img = `<img src='img/wsymbol_0010_heavy_rain_showers.svg' alt=""/>`;
            break;
        case '11d':
            img = `<img src='img/wsymbol_0024_thunderstorms.svg' alt=""/>`;
            break;
        case '13d':
            img = `<img src='img/wsymbol_0020_cloudy_with_heavy_snow.svg' alt=""/>`;
            break;
        case '50d':
            img = `<img src='img/wsymbol_0006_mist.svg' alt=""/>`;
            break;
        default:
            img = `<img src='img/wsymbol_0001_sunny.svg' alt=""/>`;
    }
    return img;
}

class WeatherCard {
    constructor(data, index) {
        this.data = data;
        this.index = index;
        this.daysOfWeekText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.createCard();
    }

    createCard() {
        this.dayElement = document.querySelectorAll('.card-day');
        this.dateElement = document.querySelectorAll('.card-date');
        this.tempElement = document.querySelectorAll('.card-temp');
        this.imgElement = document.querySelectorAll('.card-img');
        this.humidityElement = document.querySelectorAll('.card-humidity');
        this.pressureElement = document.querySelectorAll('.card-pressure');
        this.sunriseElement = document.querySelectorAll('.card-sunrise');
        this.sunsetElement = document.querySelectorAll('.card-sunset');

        const currDate = new Date(this.data.dt * 1000);

        this.dayElement[this.index].innerHTML = this.daysOfWeekText[currDate.getDay()];
        this.dateElement[this.index].innerHTML = `${currDate.getDate()}.${currDate.getMonth() + 1}.${currDate.getFullYear()}`;
        this.tempElement[this.index].innerHTML = Math.round(this.data.temp.eve) + "°";
        this.humidityElement[this.index].children[0].innerHTML = ` ${this.data.humidity}%`;
        this.pressureElement[this.index].children[0].innerHTML = ` ${this.data.pressure}MB`;

        // this.imgElement[this.index].innerHTML = `<img src='https://openweathermap.org/img/wn/${this.data.weather[0].icon}.png' alt=""/>`;
        this.imgElement[this.index].innerHTML = getIcon(this.data.weather[0].icon);

        const timeSunrise = new Date(this.data.sunrise * 1000);
        const formattedTimeSunrise = `${timeSunrise.getHours()}:${timeSunrise.getMinutes()}`;

        const timeSunset = new Date(this.data.sunset * 1000);
        const formattedTimeSunset = `${timeSunset.getHours()}:${timeSunset.getMinutes()}`;

        this.sunriseElement[this.index].children[0].innerHTML = ` ${formattedTimeSunrise} AM`;
        this.sunsetElement[this.index].children[0].innerHTML = ` ${formattedTimeSunset} PM`;
    }
}

getWeather('Odesa');

