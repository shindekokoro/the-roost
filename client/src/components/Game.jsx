import { Box, Grid, Typography } from '@mui/material';
import { setLocalStorageData, getLocalStorageData, setEventContext, getEventContext } from '../utils/localStorage';
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

    // get a random event
    const getEvent = () => {
        // options for the event type
        let eventOptions = ['combat', 'interaction', 'movement']
        // get the event type 
        const eventType = eventOptions[Math.floor(Math.random() * options.length)];
        // get the event 
        const event = data[eventType][Math.floor(Math.random() * data[eventType].length)];
        // return the event 
        return event;
    }



    return (
        <Box sx={{ backgroundImage: `url('../zombie_turkey_king.png')` }}>
            <Character characterData={data.currentPlayer} hp={characterHP} />
        </Box>
    );
}