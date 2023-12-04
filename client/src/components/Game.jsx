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
import newEvent from '../utils/newEvent';

export default function Game() {
  // get all data from local storage: { currentPlayer, combat, interaction, movement }
  const data = getLocalStorageData();

  // get event context from local storage {characterHP, enemyHP, currentEvent}
  const eventContext = getEventContext();

  // set up state so component will re-render when event context changes like changing events or taking damage
  const [characterHP, setCharacterHP] = useState(eventContext.characterHP);
  const [enemyHP, setEnemyHP] = useState(eventContext.enemyHP);
  const [currentEvent, setCurrentEvent] = useState(eventContext.currentEvent);
  const [enemyData, setEnemyData] = useState({
    level: 0,
    name: '',
    maxHP: 0,
    strength: 0,
    defense: 0,
    constitution: 0,
    inventory: []
  });

  // set up state to disable buttons while event is running
  const disableButtonsRef = useRef(false);
  const eventResultMessageRef = useRef('Event Result');

  // if there is no current event, get a new one
  if (currentEvent === null) {
    newEvent(
      disableButtonsRef,
      data,
      characterHP,
      setCharacterHP,
      enemyHP,
      setEnemyHP,
      setCurrentEvent
    );
  }

  // take current event and run it
  const RunMovementEvent = NonCombatHandler;
  const RunInteractionEvent = NonCombatHandler;

  // for testing
  const runEvent = (event) => {
    // check the event type
    switch (event.__typename) {
      case 'Combat':
        // run combat event
        return (
          <CombatHandler
            event={event}
            disableButtonsRef={disableButtonsRef}
            eventResultMessageRef={eventResultMessageRef}
            characterHP={characterHP}
            setCharacterHP={setCharacterHP}
            enemyHP={enemyHP}
            setEnemyHP={setEnemyHP}
            setCurrentEvent={setCurrentEvent}
            enemyData={enemyData}
            setEnemyData={setEnemyData}
          />
        );
      case 'Interaction':
        // run interaction event
        return (
          <RunInteractionEvent
            event={event}
            disableButtonsRef={disableButtonsRef}
            eventResultMessageRef={eventResultMessageRef}
            characterHP={characterHP}
            setCharacterHP={setCharacterHP}
            enemyHP={enemyHP}
            setEnemyHP={setEnemyHP}
            setCurrentEvent={setCurrentEvent}
          />
        );
      case 'Movement':
        // run movement event
        return (
          <RunMovementEvent
            event={event}
            disableButtonsRef={disableButtonsRef}
            eventResultMessageRef={eventResultMessageRef}
            characterHP={characterHP}
            setCharacterHP={setCharacterHP}
            enemyHP={enemyHP}
            setEnemyHP={setEnemyHP}
            setCurrentEvent={setCurrentEvent}
          />
        );

      default:
        console.error(
          `Invalid event type, expected 'Combat', 'Interaction', or 'Movement', got: ${event.__typename}`
        );
        return <Error />;
    }
  };
  // if there is no current event, get a new one

  return (
    <Box alignContent={'center'}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', zIndex: -99 }}
      >
        <Character characterData={data.currentPlayer} hp={characterHP} />
        <Enemy enemyData={enemyData} hp={enemyHP} />
      </Box>
      {runEvent(currentEvent)}
    </Box>
  );
}
