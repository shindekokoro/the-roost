import { Box, Grid, Typography, Button } from '@mui/material';
import { setLocalStorageData, getLocalStorageData, setEventContext, getEventContext } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import { Character } from '../components';
import { useEffect, useState, useRef } from 'react';
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
        let eventOptions = ['combat', 'interaction', 'movement']
        // get the event type 
        const eventType = eventOptions[Math.floor(Math.random() * eventOptions.length)];
        // get the event 
        const event = data[eventType][Math.floor(Math.random() * data[eventType].length)];
        // return the event 
        return event;
    }

    /**
     * Get a new event and set it in local storage and update state - this will cause the component to re-render
     * @returns {void}
     */
    let isCombatEvent = false;
    const newEvent = () => {
        // reset the disable buttons ref so buttons will be enabled
        disableButtonsRef.current = false;
        // get a random event
        let event = getEvent();
        // set the event context in local storage
        if (!isCombatEvent) {
            setEventContext({
                characterHP: characterHP,
                enemyHP: enemyHP,
                currentEvent: event
            });
        }
        // reset isCombatEvent
        isCombatEvent = false;

        // update state
        setCurrentEvent(event);
    }

    // if there is no current event, get a new one
    if (currentEvent === null) {
        newEvent();
    }

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
            setLocalStorageData([character], data.combat, data.interaction, data.movement);
            // update the global data object
            data.currentPlayer = [character];
            // graphql definition of character does not include __typename, so it must be deleted before saving
            delete character.__typename;
            character.inventory.forEach((item) => delete item.__typename)
            console.log(character);
            // save the character in the database
            let updatedCharacter = await saveCharacter({
                variables: { characterData: character }
            });
            return updatedCharacter;
        }
        modifyStat(statToModify, statValue);

        // display the result description
        console.log(description);

        // display a button to continue to the next event
        // could use css display none to hide the button until the event is over and then display it
        // update options to only have one option to continue to the next event

        disableButtonsRef.current = true;

        eventResultMessageRef.current = description;
    }

    const combatHandler = (event) => {
        // render the event
        console.log(event);
        let description = event.description;
        let background = event.background;
        let results = event.result;
        let player = data.currentPlayer[0];
        let random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
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
            strength: Math.floor(event.strength + (player.level / 4)),
            defense: Math.floor(event.defense + (player.level / 4)),
            constitution: Math.floor(event.constitution + (player.level / 4)),
            inventory: event.inventory,
        }

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
                })
                // TODO: something is wrong
                eventResultMessageRef.current = result.description;
                disableButtonsRef.current = true;
                isCombatEvent = true;
                return true
            }
            return false
        }

        if (characterHP <= 0) {
            // redirect to game over page
            // TODO: make a game over page
            // game over page will reset the characters hp in local storage?
            return <Navigate to="/profile" />;
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
        }

        let enemyAttack = () => {
            let hitPower = random(1, enemy.strength);
            if (hitPower > player.defense) {
                player.hp -= hitPower;
                console.log(`Enemy attacks for ${hitPower}!`);
                console.log(`You have ${player.hp} hp left!`);
            }
            console.log('Enemy attacks and misses!');
        }

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
        }

        let run = () => {
            // let damage = Math.floor(Math.random() * 5);
            // setCharacterHP(characterHP - damage);
            console.log('coward!'); 
        }

        return (
            <Box sx={{ backgroundImage: `url('../${background}')` }}>
                {description}
                <br />
                <Character characterData={[enemy]} hp={enemy.hp} />
                <br />
                <Button onClick={() => attack()} disabled={disableButtonsRef.current} >
                    Attack
                </Button>
                <Button onClick={() => defend()} disabled={disableButtonsRef.current} >
                    Defend
                </Button>
                <Button onClick={() => run()} disabled={disableButtonsRef.current} >
                    Run!
                </Button>
            </Box>
        )
    }
    const runCombatEvent = combatHandler;


    const nonCombatHandler = (event) => {
        // render the event
        let description = event.description;
        let background = event.background;
        let name = event.name;
        let options = event.options;

        console.log(options)
        return (
            <Box sx={{ backgroundImage: `url('../${background}')` }}>
                {name}
                <br />
                {description}
                <br />
                {options.map((option, index) => (
                    <Button key={index} onClick={() => eventResult(JSON.stringify(option.result))} disabled={disableButtonsRef.current} >
                        <div>{option.description}</div>
                    </Button>
                ))}
            </Box>
        )
    }
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
                console.error(`Invalid event type, expected 'Combat', 'Interaction', or 'Movement', got: ${event.__typename}`);
                break;
        }
    }
    runEvent(currentEvent);

    return (
        <Box>
            <Character characterData={data.currentPlayer} hp={characterHP} />
            <br />
            {eventComponent}
            <br />
            {disableButtonsRef.current ? 
                    <Box>
                        <p>{eventResultMessageRef.current}</p>
                        <Button onClick={() => newEvent()}>Continue</Button>
                    </Box>
                    : 
                    <Box></Box>
            }
        </Box>
    );
}