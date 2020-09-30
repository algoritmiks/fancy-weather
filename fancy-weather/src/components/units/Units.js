import React, { useState } from 'react';

function Units(props) {
  const [ units, changeUnitsInState ] = useState('switcher controls_item');

  const onChangeUnits = () => {
    if ( units.includes('switcher_on') ) {
      changeUnitsInState('switcher controls_item');
      props.changeUnits('C');
    } else {
      changeUnitsInState('switcher switcher_on controls_item');
      props.changeUnits('F');
    }
  }

  return (
    <div className={ units } onClick={ onChangeUnits }></div>
  );
}

export default Units;