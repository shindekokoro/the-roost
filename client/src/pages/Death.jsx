import { Link as ReactRouter } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { setEventContext } from '../utils/localStorage';

export default function Death() {
  setEventContext(null);
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <Typography sx={{ my: '10em' }} variant="body1">
        <h1>YOU DIED. RIP</h1>
      </Typography>
      <Button
        component={ReactRouter}
        to="/play"
        variant="outlined"
        sx={{ m: 1 }}
        >
        Play Again
      </Button>
      <Button 
        component={ReactRouter} 
        to="/highscores" 
        variant="outlined" 
        sx={{ m: 1 }}
        >
        High Scores
      </Button>
      <Button 
        component={ReactRouter} 
        to="/profile" 
        variant="outlined" 
        sx={{ m: 1 }}
        >
        Profile
      </Button>
    </Box>
  );
}