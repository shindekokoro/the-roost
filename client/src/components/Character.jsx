import { Box, Stack, Typography } from '@mui/material';
import { GiHealthPotion } from 'react-icons/gi';

export default function Character({ characterData, hp }) {
  return (
    <Box>
      <Typography variant="h5">{characterData[0].name}</Typography>
      <Typography variant="body2">
        {hp} / {characterData[0].constitution * 10} <GiHealthPotion />
      </Typography>
    </Box>
  );
}
