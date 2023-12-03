import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  GiHealthPotion,
  GiAbacus,
  GiWisdom,
  GiGoldBar,
  GiOpenTreasureChest
} from 'react-icons/gi';
import { AiOutlineNumber } from 'react-icons/ai';
import { FaHandFist, FaShieldHalved } from 'react-icons/fa6';

export default function Character({ characterData, hp }) {
  return (
    <Box sx={{ background: '#05050550', padding: 1, borderRadius: '10%' }}>
      <Typography variant="h6">{characterData[0].name}</Typography>
      <Typography variant="caption">
        <Typography>
          <GiHealthPotion /> {hp} / {characterData[0].constitution * 10}
        </Typography>
        <Typography>
          <AiOutlineNumber /> {characterData[0].level}
        </Typography>
        <Typography>
          <GiAbacus /> {characterData[0].xp}
        </Typography>
        <Typography>
          <FaHandFist /> {characterData[0].strength}
        </Typography>
        <Typography>
          <FaShieldHalved /> {characterData[0].defense}
        </Typography>
        <Typography>
          <GiWisdom /> {characterData[0].constitution}
        </Typography>
        <Typography>
          <GiGoldBar /> {characterData[0].gold}
        </Typography>
        <Typography>
          <GiOpenTreasureChest /> {characterData[0].inventory.length}
        </Typography>
      </Typography>
    </Box>
  );
}
