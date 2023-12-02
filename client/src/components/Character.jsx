import { Box, Typography } from '@mui/material';
import { GiHealthPotion } from 'react-icons/gi';

export default function Character({ characterData, currentHP }) {
  console.log(characterData);
  return (
    <Box>
      <Typography variant="h5">{characterData.name}</Typography>
      <Typography variant="body2">
        {currentHP} / {characterData.maxHP} <GiHealthPotion />
      </Typography>
    </Box>
  );
}
