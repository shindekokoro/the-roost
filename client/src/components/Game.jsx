import { Box } from '@mui/material';
import {
  setLocalStorageData,
  getLocalStorageData,
  setEventContext,
  getEventContext
} from '../utils/localStorage';
import { Character, Enemy } from '../components';
import { useState, useRef } from 'react';
import { CombatHandler, NonCombatHandler } from '../components';

export default function Game() {
  // get all data from local storage: { currentPlayer, combat, interaction, movement }
  const data = getLocalStorageData();
  let enemyData;

  // get event context from local storage {characterHP, enemyHP, currentEvent}
  const eventContext = getEventContext();

  // set up state so component will re-render when event context changes like changing events or taking damage
  const [characterHP, setCharacterHP] = useState(eventContext.characterHP);
  const [enemyHP, setEnemyHP] = useState(eventContext.enemyHP);
  const [currentEvent, setCurrentEvent] = useState(eventContext.currentEvent);

  // set up state to disable buttons while event is running
  const disableButtonsRef = useRef(false);
  const eventResultMessageRef = useRef('Event Result');

  /**
   * Get a random event of a random type
   * @returns {object} event object {characterHP, enemyHP, currentEvent}
   */
  const getEvent = () => {
    // options for the event type
    let eventOptions = ['combat', 'interaction', 'movement'];
    // get the event type
    const eventType =
      eventOptions[Math.floor(Math.random() * eventOptions.length)];
    // get the event
    const event =
      data[eventType][Math.floor(Math.random() * data[eventType].length)];
    // return the event
    return event;
  };

  /**
   * Get a new event and set it in local storage and update state - this will cause the component to re-render
   * @returns {void}
   */
  const newEvent = () => {
    // reset the disable buttons ref so buttons will be enabled
    disableButtonsRef.current = false;
    // get a random event
    let event = getEvent();
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

  // if there is no current event, get a new one
  if (currentEvent === null) {
    newEvent();
  }

  // take current event and run it
  const RunMovementEvent = NonCombatHandler;
  const RunInteractionEvent = NonCombatHandler;

  // for testing
  let eventComponent;
  const runEvent = (event) => {
    // check the event type
    switch (event.__typename) {
      case 'Combat':
        // run combat event
        eventComponent = (
          <CombatHandler
            event={event}
            disableButtonsRef={disableButtonsRef}
            eventResultMessageRef={eventResultMessageRef}
          />
        );
        break;
      case 'Interaction':
        // run interaction event
        eventComponent = (
          <RunInteractionEvent
            event={event}
            disableButtonsRef={disableButtonsRef}
            eventResultMessageRef={eventResultMessageRef}
          />
        );
        break;
      case 'Movement':
        // run movement event
        eventComponent = (
          <RunMovementEvent
            event={event}
            disableButtonsRef={disableButtonsRef}
            eventResultMessageRef={eventResultMessageRef}
          />
        );
        break;
      default:
        console.error(
          `Invalid event type, expected 'Combat', 'Interaction', or 'Movement', got: ${event.__typename}`
        );
        break;
    }
  };
  runEvent(currentEvent);

  return (
    <Box alignContent={'center'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Character characterData={data.currentPlayer} hp={characterHP} />
        {enemyData ? <Enemy enemyData={enemyData} hp={enemyHP} /> : <></>}
      </Box>
      {eventComponent}
    </Box>
  );
}
