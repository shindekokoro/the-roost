import { Box, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { Footer } from '../components';

export default function combatHandler({ event, disableButtonsRef }) {
  if (!enemyHP) {
    // set enemy hp
    setEventContext({
      characterHP: data.currentPlayer[0].constitution * 10,
      enemyHP: event.constitution * 10,
      currentEvent: event
    });
    setEnemyHP(event.constitution * 10);
  }
  // render the event
  //console.log(event);
  let description = event.description;
  let background = event.background;
  let results = event.result;
  let player = data.currentPlayer[0];
  let random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  // TODO: enemy stats scale with player level, 1 every 4 levels
  enemyData = {
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
  };

  let enemyDeathHandler = () => {
    //
    console.log('Enemy is dead! Victory!');

    setEventContext({
      characterHP: characterHP,
      enemyHP: null,
      currentEvent: null
    });

    // run the event result
    eventResult(results);
  };

  if (characterHP <= 0) {
    return <Navigate to="/death" />;
  }

  let attack = () => {
    let hitPower = random(1, player.strength);
    if (hitPower > enemyData.defense) {
      if (enemyHP - hitPower <= 0) {
        enemyDeathHandler();
      } else {
        setEnemyHP(enemyHP - hitPower);
      }
      console.log(`You attack for ${hitPower}!`);
    } else {
      console.log('You attack and miss!');
    }
    // TODO: disable the buttons while the event is running
    setTimeout(() => {
      enemyAttack();
    }, 1000);
  };

  let enemyAttack = () => {
    let hitPower = random(1, enemyData.strength);
    if (hitPower > player.defense) {
      setCharacterHP(characterHP - hitPower);
      console.log(`Enemy attacks for ${hitPower}!`);
    } else {
      console.log('Enemy attacks and misses!');
    }
  };

  let defend = () => {
    // TODO: disable the buttons while the event is running
    setTimeout(() => {
      let hitPower = random(1, enemyData.strength);
      if (hitPower > player.defense * 2) {
        setCharacterHP(characterHP - hitPower);
        console.log(`You defend and take ${hitPower} damage!`);
      }
      console.log('You block the enemies attack!');
    }, 500);
  };

  let run = () => {
    console.log('coward!');
    newEvent();
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
              onClick={() => newEvent()}
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
