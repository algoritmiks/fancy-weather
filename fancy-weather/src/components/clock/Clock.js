import React from 'react';

class Clock extends React.Component {
  state = {
    stampUTC: 0,
    weekDay: 0,
  }

  getStampUTC() {
    let now = new Date();
    return now.getTime() + now.getTimezoneOffset()*60*1000;
  }

  getWeekDay() {
    return new Date(this.getStampUTC() + ( this.props.timezone || 0 )).getDay();
  }

  getCurrentDate(currentDateStamp) {
    return new Date(currentDateStamp);
  }
  
  getCurrentDateStamp() {
    return this.getStampUTC() + ( this.props.timezone || 0 );
  }

  setCurrentDateToState(currentDate) {
    this.props.setCurrentDate(currentDate);
  }

  componentDidMount() {
    this.setState({
      stampUTC: this.getStampUTC()
    });
    
    this.timer = setInterval(()=>{
      let currentDateStamp = this.getCurrentDateStamp();
      let currentDate = this.getCurrentDate(currentDateStamp);
      this.setCurrentDateToState(currentDateStamp);
      this.setState({
        stampUTC: this.state.stampUTC + 1000,
        weekDay: currentDate.getDay(),
      });
    }, 1000);
  }

  render () {
    return (
    <div className = "clock">
      <div className = "clock_date">
        { new Date(this.state.stampUTC + ( this.props.timezone || 0 )).toLocaleString(this.props.contryCode) } 
      </div>
      <div className = "clock_day">
        { this.props.state.localisations[`${this.props.state.language}`].day[this.state.weekDay] }
      </div>
    </div>
    )
  }
}

export default Clock;