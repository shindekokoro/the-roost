import { Box, Typography, Button } from '@mui/material';
import {
  setLocalStorageData,
  getLocalStorageData,
  setEventContext,
  getEventContext
} from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import { Character, Footer, Enemy } from '../components';
import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Game() {
  // get all data from local storage: { currentPlayer, combat, interaction, movement }
  const data = getLocalStorageData();

  // get event context from local storage {characterHP, enemyHP, currentEvent}
  const eventContext = getEventContext();

  // set up state so component will re-render when event context changes like changing events or taking damage
  const [characterHP, setCharacterHP] = useState(eventContext.characterHP);
  const [enemyHP, setEnemyHP] = useState(eventContext.enemyHP);
  const [currentEvent, setCurrentEvent] = useState(eventContext.currentEvent);

  // set up state to disable buttons while event is running
  const disableButtonsRef = useRef(false);
  const eventResultMessageRef = useRef('Event Result');

  // setup mutation to save character in database
  const [saveCharacter, { error }] = useMutation(SAVE_CHARACTER);

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

  // for testing
  let eventComponent;
  /**
   * Parses a array of results (if passed in as a json string) and returns and executes a random result
   */
  const eventResult = (results) => {
    let resultsArray = results;
    // parse the results if its a string
    if (typeof resultsArray === 'string') {
      resultsArray = JSON.parse(results);
    }
    // get a random result
    let result = resultsArray[Math.floor(Math.random() * resultsArray.length)];
    // spread the result data into variables
    let { description, nextEvent, statToModify, statValue } = result;
    // display the result data
    console.table({ description, nextEvent, statToModify, statValue });

    /**
     * Updates the character's stats in local storage, the global data object, and the database
     * @param {string} statToModify one of the character db properties e.g. hp, attack, defense, gold, etc.
     * @param {number} statValue value to add to the stat e.g. 10, -5, etc. (negative values will decrease the stat)
     * @returns {object} updated character object from the database
     */
    const modifyStat = (statToModify, statValue) => {
      // get the character stored in local storage
      let { currentPlayer } = getLocalStorageData();
      let character = currentPlayer[0];
      // modify the stat
      character[statToModify] += statValue;
      // update the character in local storage
      setLocalStorageData(
        [character],
        data.combat,
        data.interaction,
        data.movement
      );
      // update the global data object
      data.currentPlayer = [character];
      // graphql definition of character does not include __typename, so it must be deleted before saving
      delete character.__typename;
      character.inventory.forEach((item) => delete item.__typename);
      //console.log(character);
      // save the character in the database
      let updatedCharacter = saveCharacter({
        variables: { characterData: character }
      });
      return updatedCharacter;
    };
    modifyStat(statToModify, statValue);

    // display the result description
    //console.log(description);

    // display a button to continue to the next event
    // could use css display none to hide the button until the event is over and then display it
    // update options to only have one option to continue to the next event

    disableButtonsRef.current = true;
    eventResultMessageRef.current = description;
  };

  const combatHandler = (event) => {
    if (!enemyHP) {
      // set enemy hp
      setEventContext({
        characterHP: data.currentPlayer[0].constitution * 10,
        enemyHP: event.constitution * 10,
        currentEvent: event
      })
      setEnemyHP(event.constitution * 10);
    }
    // render the event
    //console.log(event);
    let description = event.description;
    let background = event.background;
    let results = event.result;
    let player = data.currentPlayer[0];
    let random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    // TODO: enemy stats scale with player level, 1 every 4 levels
    let enemy = {
      level: parseInt(event.strength) + parseInt(event.defense) + parseInt(event.constitution),
      name: event.name,
      maxHP: event.constitution * 10,
      strength: event.strength,
      defense: event.defense,
      constitution: event.constitution,
      inventory: event.inventory
    };

    let enemyDeathHandler = () => {
      // 
      console.log('Enemy is dead! Victory!');

      setEventContext({
        characterHP: characterHP,
        enemyHP: null,
        currentEvent: null
      });

      // run the event result
      eventResult(results)
    };

    if (characterHP <= 0) {
      return <Navigate to="/death" />;
    }

    let attack = () => {
      let hitPower = random(1, player.strength);
      if (hitPower > enemy.defense) {
        if (enemyHP - hitPower <= 0) {
          enemyDeathHandler();
        } else {
          setEnemyHP(enemyHP - hitPower);
        }
        console.log(`You attack for ${hitPower}!`);
      } else {
        console.log('You attack and miss!');
      }
      // TODO: disable the buttons while the event is running
      setTimeout(() => {
        enemyAttack();
      }, 1000);
    };

    let enemyAttack = () => {
      let hitPower = random(1, enemy.strength);
      if (hitPower > player.defense) {
        setCharacterHP(characterHP - hitPower);
        console.log(`Enemy attacks for ${hitPower}!`);
      } else {
        console.log('Enemy attacks and misses!');
      }
    };

    let defend = () => {
      // TODO: disable the buttons while the event is running
      setTimeout(() => {
        let hitPower = random(1, enemy.strength);
        if (hitPower > player.defense * 2) {
          setCharacterHP(characterHP - hitPower);
          console.log(`You defend and take ${hitPower} damage!`);
        }
        console.log('You block the enemies attack!');
      }, 500);
    };

    let run = () => {
      console.log('coward!');
      newEvent();
    };

    const options = [
      { description: 'Attack' },
      { description: 'Defend' },
      { description: 'Run!' }
    ];

    const combatResult = (option) => {
      switch (option) {
        case 'Attack':
          return attack();
        case 'Defend':
          return defend();
        case 'Run!':
          return run();
        default:
          console.error('Combat Error, no option supplied.');
          break;
      }
    };

    return (
      <>
        <Enemy enemyData={enemy} hp={enemyHP} position={'right'} />
        <Box
          sx={{
            flexDirection: 'column',
            display: 'inline-flex',
            alignItems: 'end',
            height: '50vh',
            width: '90vw',
            backgroundImage: `url('../${background}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            padding: '10px',
            justifyContent: 'flex-end'
          }}
        >
          <Typography>{description}</Typography>
          <Footer options={options} combatResult={combatResult} disabled={disableButtonsRef.current} />
        </Box>
      </>
    );
  };
  const runCombatEvent = combatHandler;

  const nonCombatHandler = (event) => {
    // render the event
    let description = event.description;
    let background = event.background;
    let name = event.name;
    let options = event.options;

    //console.log(options);
    return (
      <Box
        sx={{
          flexDirection: 'column',
          display: 'inline-flex',
          alignItems: 'end',
          height: '50vh',
          width: '90vw',
          backgroundImage: `url('../${background}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '10px',
          justifyContent: 'flex-end'
        }}
      >
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body1">{description}</Typography>
        <Footer options={options} eventResult={eventResult} disabled={disableButtonsRef.current} />
      </Box>
    );
  };
  const runMovementEvent = nonCombatHandler;
  const runInteractionEvent = nonCombatHandler;

  // take current event and run it
  const runEvent = (event) => {
    // check the event type
    switch (event.__typename) {
      case 'Combat':
        // run combat event
        eventComponent = runCombatEvent(event);
        break;
      case 'Interaction':
        // run interaction event
        eventComponent = runInteractionEvent(event);
        break;
      case 'Movement':
        // run movement event
        eventComponent = runMovementEvent(event);
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Character characterData={data.currentPlayer} hp={characterHP} />
      </Box>
      <br />

      {eventComponent}
      <br />
      {disableButtonsRef.current ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <p>{eventResultMessageRef.current}</p>
          <Button onClick={() => newEvent()} variant="outlined">
            Continue
          </Button>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}
