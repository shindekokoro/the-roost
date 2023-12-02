import { Link as ReactRouter } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <Typography sx={{ my: '10em' }} variant="body1">Welcome to the Roost!</Typography>
      <Button component={ReactRouter} to="/play" variant='outlined'>
        Play Game
      </Button>
    </Box>
  );
}
