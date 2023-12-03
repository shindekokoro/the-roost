import { Box, Typography } from '@mui/material';
import { GiHealthPotion } from 'react-icons/gi';

export default function Character({ characterData, hp }) {
  return (
    <Box>
      <Typography variant="h5">{characterData[0].name}</Typography>
      <Typography variant="body2">
        HP: {hp} / {characterData[0].constitution * 10} <GiHealthPotion /><br />
        LVL: {characterData[0].level}<br />
        XP: {characterData[0].xp}<br />
        STR: {characterData[0].strength}<br />
        DEF: {characterData[0].defense}<br />
        CON: {characterData[0].constitution}<br />
        Gold: {characterData[0].gold}<br />
        Items: {characterData[0].inventory.length}<br />
      </Typography>
    </Box>
  );
}
