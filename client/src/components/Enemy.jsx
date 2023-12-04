import { Box, Card, CardContent, Typography } from '@mui/material';
import { GiHealthPotion, GiWisdom, GiOpenTreasureChest } from 'react-icons/gi';
import { AiOutlineNumber } from 'react-icons/ai';
import { FaHandFist, FaShieldHalved } from 'react-icons/fa6';

export default function Enemy({ enemyData, hp }) {
  console.log(enemyData);
  if (hp < 1) {
    return <></>;
  }
  return (
    <Box
      sx={{
        textAlign: 'end',
        padding: '1em',
        borderRadius: '0.25rem',
        background: 'rgba(0,0,0,0.5)'
      }}
    >
      <Typography variant="h6">{enemyData.name}</Typography>
      <Typography variant="caption">
        <Typography>
          {hp} / {enemyData.constitution * 10} <GiHealthPotion />
        </Typography>
        <Typography>
          {enemyData.level} <AiOutlineNumber />
        </Typography>
        <Typography>
          {enemyData.strength} <FaHandFist />
        </Typography>
        <Typography>
          {enemyData.defense} <FaShieldHalved />
        </Typography>
        <Typography>
          {enemyData.constitution} <GiWisdom />
        </Typography>
        <Typography>
          {enemyData.inventory.length} <GiOpenTreasureChest />
        </Typography>
      </Typography>
    </Box>
  );
}
