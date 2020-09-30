import React from 'react';
import TodayCard from '../todayCard/TodayCard';
import NextDayCard from '../nextDayCard/NextDayCard';

function Weather (props) {
  const todayWeather = {};
  const futureWeather = [];
  const nextDaysDates = [];

  const createDate = (days) => {
    let newTimeStamp = props.state.currentDate + days * 24 * 60 * 60 * 1000;
    return new Date(newTimeStamp);
  }

  const getDateData = (date) => {
    const localisation = props.state.localisations[props.state.language];
    
    return {
      year: date.getFullYear(),
      month: localisation.month[date.getMonth()],
      weekDay: localisation.day[date.getDay()],
      date: date.getDate()
    }
  }

  if (props.state.currentDate) {
    const day1Date = createDate(1);
    const day2Date = createDate(2);
    const day3Date = createDate(3);
    nextDaysDates.push(getDateData(day1Date));
    nextDaysDates.push(getDateData(day2Date));
    nextDaysDates.push(getDateData(day3Date));
  }

  if (props.state.weather) {
    const lang = props.state.localisations[`${props.state.language}`];
    const todayWeatherData = props.state.weather.data[0]; 
    const todayWeatherCode = todayWeatherData.weather.code;
    const todayFeelsTemp = Math.round( (todayWeatherData.app_min_temp + todayWeatherData.app_max_temp) / 2 );
    const todayFeelsTempF = Math.round(todayFeelsTemp * 9 / 5 + 32);
    
    
    todayWeather.picture = `https://www.weatherbit.io/static/img/icons/${todayWeatherData.weather.icon}.png`;
    todayWeather.temp = `${Math.round(todayWeatherData.temp)}°`;
    todayWeather.tempF = `${Math.round((Math.round(todayWeatherData.temp) * 9 / 5) + 32)}°`;
    todayWeather.feel = `${lang.feel} ${todayFeelsTemp}°`;
    todayWeather.feelF = `${lang.feel} ${todayFeelsTempF}°`;
    todayWeather.descr = lang.weather[todayWeatherCode];
    todayWeather.humidity = `${lang.humidity} ${todayWeatherData.rh}%`;
    todayWeather.wind = `${lang.wind} ${Math.round(todayWeatherData.wind_spd)} m/s`
    
    const data = props.state.weather.data;
    data.forEach((el, ind) => {
      if(ind > 0) {
        futureWeather.push({
          temp: `${Math.round(el.temp)}°`,
          tempF: `${Math.round((Math.round(el.temp) * 9 / 5) + 32)}°`,
          descr: lang.weather[el.weather.code],
          picture: `https://www.weatherbit.io/static/img/icons/${el.weather.icon}.png`
        })
      }
    })
  }


  return (
    <div className="weather-wrapper">
      <TodayCard state = { props.state } weather = { todayWeather } setCurrentDate = { props.setCurrentDate }/>
      <div className="weather-future-wrapper">
        <NextDayCard units = {props.state.units} weather = { futureWeather[0] } dateData = {nextDaysDates[0]}/>
        <NextDayCard units = {props.state.units} weather = { futureWeather[1] } dateData = {nextDaysDates[1]}/>
        <NextDayCard units = {props.state.units} weather = { futureWeather[2] } dateData = {nextDaysDates[2]}/>
      </div>
    </div>
  )
  
}

export default Weather;