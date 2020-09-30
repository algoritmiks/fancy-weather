import React from 'react';
import axios from 'axios';
import './style.scss';
import Controls from './components/controls/Controls';
import Weather from './components/weather/Weather';
import Map from './components/map/Map';
import * as constants from './helpers/constants/constants';
import en from './helpers/localizations/en.json'
import ru from './helpers/localizations/ru.json'
import be from './helpers/localizations/be.json'

export class App extends React.Component {
  state = {
    localisations: {en: en, ru: ru, be: be},
    lat: '57.6263877',
    lng: '39.8933705',
    latitude: '',
    longitude: '',
    language: 'en',
    units: 'C',
    url: 'url(/img/bg-default.jpg)',
    currentPageAPI: 1,
    countryTranslates: {
      en: "Russia",
      ru: "Россия",
      be: "Расія"
    },
    cityTranslates: {
      en: "Yaroslavl",
      ru: "Ярославль",
      be: "Яраслаўль"
    }
  }

  getImageFromAPI = () => {
    return axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${constants.tokens.pictures}&tags=nature,landscape&tag_mode=all&page=${this.state.currentPageAPI}&per_page=1&extras=url_c&format=json&nojsoncallback=1`)
      .then(response => {
        this.setState({
          url: `url(${response.data.photos.photo[0].url_c})`,
          currentPageAPI: this.state.currentPageAPI + 1
         })
      })
      .catch(error => {
        this.setState({
          url: 'url(/img/bg-default.jpg)',
          currentPageAPI: 1
         })
      })
  }

  getWeatherFromAPI = (newState) => {
    return axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?&key=${constants.tokens.weatherbit}&lat=${newState.lat}&lon=${newState.lng}&lang=en&days=4`)
      .then(response => {
        newState.weather = response.data;
        this.setState({...newState})
      })
  }
  
  getCityTranslate = (newState) => {
    return axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${constants.tokens.translate}&lang=be&text=Cedar Rapids United States of America`)
  }

  changeLocation = (newLocation) => {
    axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${newLocation}&key=${constants.tokens.opencagedata}&language=en_US&pretty=1`)
      .then(response => {
        if (response.data.total_results > 0) {

          const tempCountry = response.data.results[0].components.country || 'unknown';
          const tempCity = response.data.results[0].components.administrative 
          || response.data.results[0].components.city
          || response.data.results[0].components.town
          || response.data.results[0].components.village 
          || response.data.results[0].components.county
          || response.data.results[0].components.state;

          let newState = {
            lat: response.data.results[0].geometry.lat,
            lng: response.data.results[0].geometry.lng,
            country: tempCountry, 
            location: tempCity, 
            countryTranslates: {
              en: tempCountry
            },
            cityTranslates: {
              en: tempCity
            },
            latitude: response.data.results[0].annotations.DMS.lat,
            longitude: response.data.results[0].annotations.DMS.lng,
            timezone: response.data.results[0].annotations.timezone.offset_sec * 1000,
            countryCode: response.data.results[0].components.country_code            
          }

          const requestString = `${newState.country}|${newState.location}`;

          Promise.all( [axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${constants.tokens.translate}&lang=ru&text=${requestString}`), 
            axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${constants.tokens.translate}&lang=be&text=${requestString}`)])
            .then(function (data) {
              const ruData = String(data[0].data.text).split("|");
              const beData = String(data[1].data.text).split("|");
              newState.countryTranslates.ru = ruData[0];
              newState.countryTranslates.be = beData[0];
              newState.cityTranslates.ru = ruData[1];
              newState.cityTranslates.be = beData[1];
            });
          return newState;
        } else {
          alert('location not found');
          return false;
        }
      })
      .then(newState => {
        if (newState) {
          this.getWeatherFromAPI(newState)
            .then(() => this.getImageFromAPI())
            .catch(error => alert(error.message))
        }
      })
      .catch(error => {
        alert('something wrong');
      })
  }

  getUserLocationByIP = () => {
    axios.get(`https://ipinfo.io/json?token=${constants.tokens.ipinfo}`)
      .then(response => {
        this.changeLocation(response.data.city);
      })
      .catch(error => {
        alert('something wrong with get location by your IP');
      });
  }

  componentDidMount() {
    this.getUserLocationByIP();
  }

  changeLanguage = (lng) => {
    this.setState({language: lng})
  }

  changeUnits = (units) => {
    this.setState({units: units})
  }

  setCurrentDate = (currentDate) => {
    this.setState({
      currentDate: currentDate
    })
  }

  render() {
    return (
    <div className="root" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5), #000), ${this.state.url}`}}>
      <div className="wrapper">
        <header className="header">
          <Controls 
            changeLanguage = {this.changeLanguage}
            getImageFromAPI = {this.getImageFromAPI}
            changeLocation = {this.changeLocation}
            changeUnits = {this.changeUnits}
            state = {this.state}
          />  
        </header>
        <main>
          <div className="weather-map-wrapper">
          <Weather state = {this.state} setCurrentDate = { this.setCurrentDate }/>
          <Map 
            state = {this.state}
          />
          </div>
        </main>
      </div>
    </div>
    )};
}

export default App;
