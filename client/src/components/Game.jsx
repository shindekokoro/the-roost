import { Box } from '@mui/material';
import {
  getLocalStorageData,
  setEventContext,
  getEventContext
} from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import { Character, Enemy, Event, Footer } from '../components';
import { useRef, useState } from 'react';

export default function Game() {
  //#region HELPER FUNCTIONS
  /**
    * Get a random event of a random type
    * @param {array} eventOptions array of event types to choose from, default is all event types
    * @returns {object} event object - see server/schemas/typeDefs.js for definition
    */
  const getEvent = (eventOptions = ['combat', 'interaction', 'movement']) => {
    // get a random event type
    const eventType = eventOptions[Math.floor(Math.random() * eventOptions.length)];
    // get the event
    const event = data[eventType][Math.floor(Math.random() * data[eventType].length)];
    // return the event
    return event;
  };
  /**
   * Get a new event and set it in local storage and update state - this will cause the event component to re-render
   * @returns {void}
   */
  const newEvent = () => {
    // get a random event
    let event = getEvent();
    // save the event in local storage
    setEventContext({
      characterHP: characterHP,
      enemyHP: enemyHP,
      currentEvent: event
    });
    // update state
    setCurrentEvent(event);
  };
  //#endregion

  //#region ALL THE DATA WE NEED TO PLAY THE GAME
  // get all data from local storage: data = { currentPlayer, combat, interaction, movement }
  const data = getLocalStorageData();
  if (!data) {
    // this should never happen, if it does, there is a bug 
    console.error('No data in local storage! Should never happen! Game.jsx line 19, likely a problem with setLocalStorageData() in Play.jsx');
  }
  // get event context from local storage {characterHP, enemyHP, currentEvent}
  const eventContext = getEventContext();

  // setup mutation to save character in database
  const [saveCharacter, { error }] = useMutation(SAVE_CHARACTER);
  // set up state so component will re-render when event context changes like changing events or taking damage
  const [characterHP, setCharacterHP] = useState(eventContext.characterHP);
  const [enemyHP, setEnemyHP] = useState(eventContext.enemyHP);
  const [currentEvent, setCurrentEvent] = useState(eventContext.currentEvent);

  if (!eventContext) {
    // should only happen on first every load of the game in a new browser
    newEvent();
  }
  //#endregion

  //#region GAME FUNCTIONALITY
  // set up state to disable buttons while event is running
  const disableButtonsRef = useRef(false);
  const eventResultMessageRef = useRef('Event Result');
  const footer = useRef(null);

  //#region Non Combat Event
  const nonCombatHandler = (event) => {
    // render the event
    let eventResult = event.result;
    let options = event.options;

    return (
      <Footer options={options} eventResult={eventResult} />
    );
  };
  //#endregion

  //#region Combat Event
  const combatHandler = (event) => {
    // render the event
    console.log(event);
    let description = event.description;
    let background = event.background;
    let results = event.result;
    let player = data.currentPlayer;
    let random = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    // player doesn't have a maxHP property, so it must be added
    // TODO: after the end of a combat event we will update characterHP to re-render?
    // maybe just ignore this? - not remembering player and enemy hp on refresh is fine?
    player.hp = characterHP;
    player.maxHP = player.constitution * 10;
    // TODO: player.hp and player.maxHP needs to be tracked in local storage?
    // enemy stats scale with player level, 1 every 4 levels
    let enemy = {
      level: event.strength + event.defense + event.constitution,
      name: event.name,
      hp: event.constitution * 10,
      maxHP: event.constitution * 10,
      strength: Math.floor(event.strength + player.level / 4),
      defense: Math.floor(event.defense + player.level / 4),
      constitution: Math.floor(event.constitution + player.level / 4),
      inventory: event.inventory
    };

    let enemyDeathHandler = () => {
      if (enemy.hp <= 0) {
        console.log(enemy.hp);
        // enemy is dead
        // TODO: display result description, button to continue to next event
        console.log('Enemy is dead! Victory!');
        let result = results[Math.floor(Math.random() * results.length)];
        setEventContext({
          characterHP: player.hp,
          enemyHP: enemy.hp,
          currentEvent: event
        });
        // TODO: something is wrong
        eventResultMessageRef.current = result.description;
        disableButtonsRef.current = true;
        isCombatEvent = true;
        return true;
      }
      return false;
    };

    if (characterHP <= 0) {
      // redirect to game over page
      // TODO: make a game over page
      // game over page will reset the characters hp in local storage?
      return <Navigate to="/death" />;
    }

    let attack = () => {
      let hitPower = random(1, player.strength);
      if (hitPower > enemy.defense) {
        enemy.hp -= hitPower;
        console.log(`You attack for ${hitPower}!`);
        console.log(`${enemy.name} has ${enemy.hp} hp left!`);
      }
      console.log('You swing and missed!');
      // TODO: disable the buttons while the event is running
      setTimeout(() => {
        enemyAttack();
      }, 1000);
    };

    let enemyAttack = () => {
      let hitPower = random(1, enemy.strength);
      if (hitPower > player.defense) {
        player.hp -= hitPower;
        console.log(`Enemy attacks for ${hitPower}!`);
        console.log(`You have ${player.hp} hp left!`);
      }
      console.log('Enemy attacks and misses!');
    };

    let defend = () => {
      // TODO: disable the buttons while the event is running
      setTimeout(() => {
        let hitPower = random(1, enemy.strength);
        if (hitPower > player.defense * 2) {
          player.hp -= hitPower;
          console.log(`You defend and take ${hitPower} damage!`);
        }
        console.log('You block the enemies attack!');
      }, 500);
    };

    let run = () => {
      // let damage = Math.floor(Math.random() * 5);
      // setCharacterHP(characterHP - damage);
      console.log('coward!');
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
      <Footer options={options} combatResult={combatResult} />
    );
  };
  //#endregion

  //#region Event Result
  // for testing
  let eventComponent;
  /**
   * Parses a array of results stored as a json string and returns and executes a random result
   */
  const eventResult = (resultsString) => {
    // parse the results string
    let resultsArray = JSON.parse(resultsString);
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
    const modifyStat = async (statToModify, statValue) => {
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
      console.log(character);
      // save the character in the database
      let updatedCharacter = await saveCharacter({
        variables: { characterData: character }
      });
      return updatedCharacter;
    };
    modifyStat(statToModify, statValue);

    // display the result description
    console.log(description);

    // display a button to continue to the next event
    // could use css display none to hide the button until the event is over and then display it
    // update options to only have one option to continue to the next event

    disableButtonsRef.current = true;

    eventResultMessageRef.current = description;
  };
  //#endregion

  //#region Run Event
  // take current event and run it
  const runEvent = (event) => {
    // check the event type
    switch (event.__typename) {
      case 'Combat':
        // run combat event
        footer.current = combatHandler(event);
        break;
      case 'Interaction':
        // run interaction event
        footer.current = nonCombatHandler(event);
        break;
      case 'Movement':
        // run movement event
        footer.current = nonCombatHandler(event);
        break;
      default:
        console.error(
          `Invalid event type, expected 'Combat', 'Interaction', or 'Movement', got: ${event.__typename}`
        );
        break;
    }
  };
  runEvent(currentEvent);
  //#endregion
  //#endregion

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Character characterData={data.currentPlayer} currentHP={characterHP} />
        <Enemy enemyData={currentEvent} currentHP={enemyHP} />
      </Box>
      <Event event={currentEvent} />

    </>
  );
}
