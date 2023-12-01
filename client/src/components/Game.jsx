import { Box, Grid, Typography, Button } from '@mui/material';
import { setLocalStorageData, getLocalStorageData, setEventContext, getEventContext } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import { Character } from '../components';
import { useEffect, useState } from 'react';


export default function Game() {
    // get all data from local storage
    const data = getLocalStorageData();

    // get event context from local storage
    const eventContext = getEventContext();

    // set up state
    const [characterHP, setCharacterHP] = useState(eventContext.characterHP);
    const [enemyHP, setEnemyHP] = useState(eventContext.enemyHP);
    const [currentEvent, setCurrentEvent] = useState(eventContext.currentEvent);

    // setup mutations
    const [saveCharacter, { error }] = useMutation(SAVE_CHARACTER);

    // get a random event
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

    if (currentEvent === null) {
        let event = getEvent();
        setEventContext({
            characterHP: characterHP,
            enemyHP: enemyHP,
            currentEvent: event
        })
        setCurrentEvent(event);
    }

    let result;

    // TODO: function to render options

    const eventResult = (resultsString) => {
        let resultsArray = JSON.parse(resultsString);
        // get a random result
        let result = resultsArray[Math.floor(Math.random() * resultsArray.length)];
        let description = result.description;
        let nextEvent = result.nextEvent;
        let statToModify = result.statToModify;
        console.table({ description, nextEvent, statToModify });


        const modifyStat = async (statToModify) => {
            // get the character stored in local storage
            let { currentPlayer } = getLocalStorageData();
            let character = currentPlayer[0];
            // parse what we need to modify the stat (e.g. 'defense' -10)
            let statToModifyArray = statToModify.split(':');
            let stat = statToModifyArray[0];
            let value = parseInt(statToModifyArray[1]);
            // modify the stat
            character[stat] += value;
            // update the character in local storage
            setLocalStorageData([character], data.combat, data.interaction, data.movement);
            // update the global data object
            data.currentPlayer = [character];
            
            delete character.__typename;
            console.log(character);
  
            let updatedCharacter = await saveCharacter({
                variables: { characterData: character }
            });
  
            console.log(updatedCharacter);
        }
        modifyStat('defense:-10');

        // display the result description

        // display a button to continue to the next event

        // modify the stat

        // check if the result has a next event id
    }

    const runMovementEvent = (event) => {
        // render the event
        let description = event.description;
        let background = event.background;
        let name = event.name;
        let options = event.options;

        return (
            <Box sx={{ backgroundImage: `url('/${background}')` }}>
                {name}
                <br></br>
                {description}
                {options.map((option, index) => (
                    <Button key={index} onClick={() => eventResult(JSON.stringify(option.result))} >
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
                //result = runCombatEvent(event);
                break;
            case 'Interaction':
                // run interaction event
                //result = runInteractionEvent(event);
                break;
            case 'Movement':
                // run movement event
                result = runMovementEvent(event);
                break;
            default:
                // run combat event
                //result = runCombatEvent(event);
                break;
        }
    }
    runEvent(currentEvent);

    return (
        <Box>
            <Character characterData={data.currentPlayer} hp={characterHP} />
            {result}
        </Box>
    );
}