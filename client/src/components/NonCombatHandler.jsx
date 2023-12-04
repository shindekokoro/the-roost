import { Box, Button, Typography } from '@mui/material';
import { Footer } from '../components';
import {
  setLocalStorageData,
  getLocalStorageData
} from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import newEvent from '../utils/newEvent';

export default function NonCombatHandler({
  event,
  disableButtonsRef,
  eventResultMessageRef,
  characterHP,
  setCharacterHP,
  enemyHP,
  setEnemyHP,
  setCurrentEvent
}) {
  // render the event
  let description = event.description;
  let background = event.background;
  let name = event.name;
  let options = event.options;

  // setup mutation to save character in database
  const [saveCharacter, { error }] = useMutation(SAVE_CHARACTER);
  const data = getLocalStorageData();
  const eventResult = (results) => {
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
      let character = currentPlayer[0];
      // level up function
      let levelUp = () => {
        // check if the character has enough xp to level up
        let level = character.level;
        let xp = character.xp;
        let xpToLevelUp = 100;
        let xpToNextLevel = xpToLevelUp * level;
        if (xp >= xpToNextLevel) {
          character.level += 1;
          character.strength += 1;
          character.defense += 1;
          character.constitution += 1;
          console.log('You leveled up!');
        }
      };
      // modify the stat
      character[statToModify] += statValue;
      // check if the character has leveled up
      levelUp();
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
  //console.log(options);
  return (
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
      {disableButtonsRef.current ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: '0.25rem',
            background: 'rgba(0,0,0,0.5)',
            marginBottom: '1em'
          }}
        >
          <p>{eventResultMessageRef.current}</p>
          <Button
            onClick={() =>
              newEvent(
                disableButtonsRef,
                data,
                characterHP,
                setCharacterHP,
                enemyHP,
                setEnemyHP,
                setCurrentEvent
              )
            }
            variant="outlined"
            sx={{ m: '1rem' }}
          >
            Continue
          </Button>
        </Box>
      ) : (
        <></>
      )}
      <Box
        sx={{
          padding: '1em',
          borderRadius: '0.25rem',
          background: 'rgba(0,0,0,0.5)'
        }}
      >
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Box>
      <Footer
        options={options}
        eventResult={eventResult}
        disabled={disableButtonsRef.current}
      />
    </Box>
  );
}
