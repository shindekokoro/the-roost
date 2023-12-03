import { Box, Typography } from '@mui/material';
import { GiHealthPotion } from 'react-icons/gi';

export default function Enemy({ enemyData, hp }) {
  return (
    <Box>
      <Typography variant="h5">{enemyData.name}</Typography>
      <Typography variant="body2">
        HP: {hp} / {enemyData.constitution * 10} <GiHealthPotion /><br />
        LVL: {enemyData.level}<br />
        STR: {enemyData.strength}<br />
        DEF: {enemyData.defense}<br />
        CON: {enemyData.constitution}<br />
      </Typography>
    </Box>
  );
}
