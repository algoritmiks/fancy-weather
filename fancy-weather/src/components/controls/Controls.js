import React, { useState } from 'react';
import Units from '../units/Units';
import Search from '../search/Search';

function Controls(props) {
  const [ animation, setAnimation ] = useState('');

  const updateClick = () => {
    setAnimation('spinner-animation');
    props.getImageFromAPI()
      .then(()=>{
          setTimeout(()=> { setAnimation('') }, 1500) })
  }

  const onChangeLanguage = (e) => {
      props.changeLanguage(e.target.value.toLowerCase())
  }
  
  return (
    <div className="controls">
      <button className="update-button controls_item" onClick={ updateClick }>
        <img className={`spinner ${animation}`} src="img/spinner.svg" alt="spinner"></img>
      </button>
      <select className="language-selector controls_item" onChange={ onChangeLanguage }>
        <option>EN</option>
        <option>RU</option>
        <option>BE</option>
      </select>
      <Units changeUnits = { props.changeUnits }/>
      <Search changeLocation = { props.changeLocation } state = {props.state}/>
    </div>
  );
}

export default Controls;