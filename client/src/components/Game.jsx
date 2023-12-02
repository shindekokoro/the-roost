import { Box, Grid, Typography, Button } from '@mui/material';
import { setLocalStorageData, getLocalStorageData, setEventContext, getEventContext } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import { Character } from '../components';
import { useEffect, useState, useRef } from 'react';


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
    const newEvent = () => {
        // reset the disable buttons ref so buttons will be enabled
        disableButtonsRef.current = false;
        // get a random event
        let event = getEvent();
        // set the event context in local storage
        setEventContext({
            characterHP: characterHP,
            enemyHP: enemyHP,
            currentEvent: event
        })
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
        // for testing
        disableButtonsRef.current = true;

        eventResultMessageRef.current = description;
    }


    const runNoCombatEvent = (event) => {
        // render the event
        let description = event.description;
        let background = event.background;
        let name = event.name;
        let options = event.options;

        console.log(options)
        return (
            <Box sx={{ backgroundImage: `url('/${background}')` }}>
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

    // take current event and run it
    const runEvent = (event) => {
        // check the event type
        switch (event.__typename) {
            case 'Combat':
                // run combat event
                newEvent();
                break;
            case 'Interaction':
                // run interaction event
                eventComponent = runNoCombatEvent(event);
                break;
            case 'Movement':
                // run movement event
                eventComponent = runNoCombatEvent(event);
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