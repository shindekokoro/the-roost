import getEvent from './getEvent';
import {
  setEventContext
} from '../utils/localStorage';

/**
 * Get a new event and set it in local storage and update state - this will cause the component to re-render
 * @returns {void}
 */
const newEvent = (disableButtonsRef, data, characterHP, setCharacterHP, enemyHP, setEnemyHP, setCurrentEvent) => {
  // reset the disable buttons ref so buttons will be enabled
  disableButtonsRef.current = false;
  // get a random event
  let event = getEvent(data);
  let newEnemyHP;
  if (event.__typename === 'Combat') {
    newEnemyHP = event.constitution * 10;
  } else {
    newEnemyHP = null;
  }
  let newCharacterHP = characterHP;
  if (!newCharacterHP) {
    newCharacterHP = data.currentPlayer[0].constitution * 10;
  }
  // set the event context in local storage)
  setEventContext({
    characterHP: newCharacterHP,
    enemyHP: newEnemyHP,
    currentEvent: event
  });

  // update state
  setCharacterHP(characterHP);
  setEnemyHP(newEnemyHP);
  setCurrentEvent(event);
};

export default newEvent;
