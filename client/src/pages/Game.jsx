import { Box, Grid, Typography } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  setLocalStorageData,
  getLocalStorageData,
  setEventContext,
  getEventContext
} from '../utils/localStorage';
import {
  QUERY_ME,
  QUERY_COMBAT_EVENTS,
  QUERY_INTERACTION_EVENTS,
  QUERY_MOVEMENT_EVENTS,
  QUERY_USER
} from '../utils/queries';
import { Character } from '../components';
import Auth from '../utils/auth';
import { useState } from 'react';

export default function Game() {
  // get all data from the database
  const { username: userParam } = useParams();

  const {
    loading: meLoading,
    data: meData,
    error: meError
  } = useQuery(QUERY_ME); // character data is nested in the user object
  const {
    loading: combatLoading,
    data: combatData,
    error: combatError
  } = useQuery(QUERY_COMBAT_EVENTS);
  const {
    loading: interactionLoading,
    data: interactionData,
    error: interactionError
  } = useQuery(QUERY_INTERACTION_EVENTS);
  const {
    loading: movementLoading,
    data: movementData,
    error: movementError
  } = useQuery(QUERY_MOVEMENT_EVENTS);

  if (meLoading || combatLoading || interactionLoading || movementLoading) {
    return <Typography>Loading...</Typography>;
  }
  console.log(meError, combatError, interactionError, movementError);

  // check if signed in
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />;
  }

  // save the data to local storage
  const characterData = meData.me;
  setLocalStorageData(
    characterData.character,
    combatData.combat,
    interactionData.interaction,
    movementData.movement
  );

  // get the data from local storage
  //const data = getLocalStorageData();

  // get a random event
  const getEvent = () => {
    // options for the event type
    let eventOptions = ['combat', 'interaction', 'movement'];
    // get the event type
    const eventType = eventOptions[Math.floor(Math.random() * options.length)];
    // get the event
    const event =
      data[eventType][Math.floor(Math.random() * data[eventType].length)];
    // return the event
    return event;
  };

  // get event context from local storage
  const eventContext = getEventContext();

  // setup state the game needs
  const { playerHP, setPlayerHP } = useState(eventContext.playerHP);
  const { enemyHP, setEnemyHP } = useState(eventContext.enemyHP);
  const { currentEvent, setCurrentEvent } = useState(eventContext.currentEvent);

  if (eventContext.currentEvent === null) {
    setCurrentEvent(getEvent());
  } else {
    setCurrentEvent(eventContext.currentEvent);
  }

  return (
    <Box sx={{ backgroundImage: url('../zombie_turkey_king.png') }}>
      <Character characterData={data.character} hp={playerHP} />
    </Box>
  );
}
