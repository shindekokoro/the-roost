import { Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { setLocalStorageData, getLocalStorageData } from '../utils/localStorage';
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

  // check if data is already in local storage, if so, load the game
  const localStorageData = getLocalStorageData();
  if (localStorageData) {
    return (
      <>
        <Game />
      </>
    );
  }

  // get all data from the database
  const { loading: meLoading, data: meData } = useQuery(QUERY_ME); 
  const { loading: combatLoading, data: combatData } = useQuery(QUERY_COMBAT_EVENTS);
  const { loading: interactionLoading, data: interactionData } = useQuery(QUERY_INTERACTION_EVENTS);
  const { loading: movementLoading, data: movementData } = useQuery(QUERY_MOVEMENT_EVENTS);

  // check if data is loading
  if (meLoading || combatLoading || interactionLoading || movementLoading) {
    return <div>Loading...</div>;
  }

  // character data is nested in the user object, we can modify characterData as it is a const so we create a deep copy of the data
  let characterData = JSON.parse(JSON.stringify(meData.me));
  characterData.character = characterData.character[0]; // currently only one character per user, this is where we would select the active character if there were multiple
  // reset the character's hp to max hp when the game is loaded, these fields are also not stored in the database so they need to be created here
  characterData.character.maxHP = characterData.character.constitution * 10;
  characterData.character.hp = characterData.character.maxHP;
  // save the data to local storage so it can be accessed by other components
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
