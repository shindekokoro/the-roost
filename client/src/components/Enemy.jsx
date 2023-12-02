import { Box, Typography } from '@mui/material';
import { GiHealthPotion } from 'react-icons/gi';

export default function Enemy({ enemyData, currentHP }) {
  console.log(enemyData);
  console.log(currentHP);
  return (
    <Box>
      <Typography variant="h5">{enemyData.name}</Typography>
      <Typography variant="body2">
        {currentHP} / {enemyData.maxHP} <GiHealthPotion />
      </Typography>
    </Box>
  );
}
