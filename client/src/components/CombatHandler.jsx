import { Box, Button, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { Footer, CombatMessage } from '../components';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import {
  getEventContext,
  setEventContext,
  setLocalStorageData,
  getLocalStorageData
} from '../utils/localStorage';
import newEvent from '../utils/newEvent';
import { useEffect, useRef, useState } from 'react';

export default function combatHandler({
  event,
  disableButtonsRef,
  eventResultMessageRef,
  characterHP,
  setCharacterHP,
  enemyHP,
  setEnemyHP,
  setCurrentEvent,
  enemyData,
  setEnemyData
}) {
  if (!enemyHP) {
    // set enemy hp
    setEventContext({
      characterHP: data.currentPlayer[0].constitution * 10,
      enemyHP: event.constitution * 10,
      currentEvent: event
    });
    setEnemyHP(event.constitution * 10);
  }
  const [saveCharacter, { error }] = useMutation(SAVE_CHARACTER);
  const data = getLocalStorageData();
  // render the event
  //console.log(event);
  let description = event.description;
  let background = event.background;
  let results = event.result;
  let player = data.currentPlayer[0];
  let random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  // TODO: enemy stats scale with player level, 1 every 4 levels
  useEffect(() => {
    setEnemyData({
      level:
        parseInt(event.strength) +
        parseInt(event.defense) +
        parseInt(event.constitution),
      name: event.name,
      maxHP: event.constitution * 10,
      strength: event.strength,
      defense: event.defense,
      constitution: event.constitution,
      inventory: event.inventory
    });
  }, [event]);

  const combatMessages = useRef([]);
  const [missState, setMissState] = useState(0);

  let enemyDeathHandler = () => {
    //
    combatMessages.current.push('Enemy is dead! Victory!');

    setEventContext({
      characterHP: characterHP,
      enemyHP: null,
      currentEvent: null
    });

    // run the event result
    eventResult(results, data);
  };

  if (characterHP <= 0) {
    return <Navigate to="/death" />;
  }

  let attack = () => {
    let hitPower = random(1, player.strength);
    if (hitPower > enemyData.defense) {
      if (enemyHP - hitPower <= 0) {
        combatMessages.current.push(`You attack for ${hitPower} and kill the enemy!`);
        enemyDeathHandler();
        return;
      } else {
        setEnemyHP(enemyHP - hitPower);
      }
      combatMessages.current.push(`You attack for ${hitPower}!`);
    } else {
      combatMessages.current.push('You attack and miss!');
      setMissState(enemyHP);
    }
    // TODO: disable the buttons while the event is running
    // removed the timeout for now
    //setTimeout(() => {
      enemyAttack();
    //}, 1000);
  };

  let enemyAttack = () => {
    let hitPower = random(1, enemyData.strength);
    if (hitPower > player.defense) {
      setCharacterHP(characterHP - hitPower);
      combatMessages.current.push(`Enemy attacks for ${hitPower}!`);
    } else {
      combatMessages.current.push('Enemy attacks and misses!');
    }
  };

  let defend = () => {
    // TODO: disable the buttons while the event is running
    // removed the timeout for now
    //setTimeout(() => {
      let hitPower = random(1, enemyData.strength);
      if (hitPower > player.defense * 2) {
        setCharacterHP(characterHP - hitPower);
        combatMessages.current.push(`You defend and take ${hitPower} damage!`);
      }
      combatMessages.current.push('You block the enemies attack!');
    //}, 500);
  };

  let run = () => {
    console.log('Coward!');
    newEvent(
      disableButtonsRef,
      data,
      characterHP,
      setCharacterHP,
      enemyHP,
      setEnemyHP,
      setCurrentEvent
    );
  };

  const options = [
    { description: 'Attack' },
    //{ description: 'Defend' },
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

  const eventResult = (results, data) => {
    console.log(results);
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

      console.log(currentPlayer);
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
    console.log(data);
  };

  return (
    <>
      <Box
        sx={{
          zIndex: -999,
          position: 'absolute',
          top: '0',
          left: '0',
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          backgroundImage: `url('../${background}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '8rem 2rem',
          justifyContent: 'flex-end'
        }}
      >
        <CombatMessage messageArray={combatMessages.current} />
        {disableButtonsRef.current ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <p>{eventResultMessageRef.current}</p>
            <Button
              onClick={() => {
                combatMessages.current = [];
                newEvent(
                  disableButtonsRef,
                  data,
                  characterHP,
                  setCharacterHP,
                  enemyHP,
                  setEnemyHP,
                  setCurrentEvent
                )}
              }
              variant="outlined"
              sx={{ m: '1rem' }}
            >
              Continue
            </Button>
          </Box>
        ) : (
          <Box></Box>
        )}
        <Box
          sx={{
            padding: '1em',
            borderRadius: '0.25rem',
            background: 'rgba(0,0,0,0.5)'
          }}
        >
          <Typography>{description}</Typography>
        </Box>
        <Footer
          options={options}
          combatResult={combatResult}
          disabled={disableButtonsRef.current}
        />
      </Box>
    </>
  );
}
