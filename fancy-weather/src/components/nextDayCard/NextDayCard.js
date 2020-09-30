import React from 'react';

function NextDayCard(props) {
  let temperature = 0;
  let description, imageURL;
  let weekDay = '';
  let month = '';
  let year = '';
  let date = '';

  if (props.weather) {
    if (props.units === 'C') {
      temperature = props.weather.temp;
    } else {
      temperature = props.weather.tempF;
    }
    description = props.weather.descr;
    imageURL = props.weather.picture;
  }

  if (props.dateData) {
    weekDay = props.dateData.weekDay;
    month = props.dateData.month;
    year = props.dateData.year;
    date = props.dateData.date;
  }
  
  return (
    <div className="weather-future">
    <div className="weather-future_item"> { weekDay }</div>
    <div className="weather-future_item">{`${date} ${month} ${year}`}</div>
      <div className="temp weather-future_item"> { temperature } </div>
      <div className="weather-future_item">
        <img className="weather-icon-future" src={imageURL} alt="weather"></img>
      </div>
      <div className="descr weather-future_item"> { description } </div>
    </div>
  );
}

export default NextDayCard;
