import { Box, Grid, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
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
  QUERY_MOVEMENT_EVENTS
} from '../utils/queries';
import Auth from '../utils/auth';
import { Game } from '../components';

export default function Play() {
  // check if signed in
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />;
  }

  // get all data from the database
  const { loading: meLoading, data: meData } = useQuery(QUERY_ME); // character data is nested in the user object
  const { loading: combatLoading, data: combatData } =
    useQuery(QUERY_COMBAT_EVENTS);
  const { loading: interactionLoading, data: interactionData } = useQuery(
    QUERY_INTERACTION_EVENTS
  );
  const { loading: movementLoading, data: movementData } = useQuery(
    QUERY_MOVEMENT_EVENTS
  );

  // check if data is loading
  if (meLoading || combatLoading || interactionLoading || movementLoading) {
    return <div>Loading...</div>;
  }

  // save the data to local storage
  const characterData = meData.me;
  setLocalStorageData(
    characterData.character,
    combatData.combat,
    interactionData.interaction,
    movementData.movement
  );

  return (
    <>
      <Game />
    </>
  );
}
