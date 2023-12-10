import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper
} from '@mui/material';
import { GiHealthPotion, GiWisdom, GiOpenTreasureChest } from 'react-icons/gi';
import { AiOutlineNumber } from 'react-icons/ai';
import { FaHandFist, FaShieldHalved } from 'react-icons/fa6';

export default function Character({ enemyData, hp }) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GiHealthPotion />
            </ListItemIcon>
            <ListItemText
              primary={`HP: ${hp} / ${enemyData.constitution * 10}`}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AiOutlineNumber />
            </ListItemIcon>
            <ListItemText primary={`Level: ${enemyData.level}`} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <FaHandFist />
            </ListItemIcon>
            <ListItemText primary={`Strength: ${character.strength}`} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <FaShieldHalved />
            </ListItemIcon>
            <ListItemText primary={`Defense: ${character.defense}`} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GiWisdom />
            </ListItemIcon>
            <ListItemText primary={`Constitution: ${character.constitution}`} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <GiOpenTreasureChest />
            </ListItemIcon>
            <ListItemText primary={`Loot: ${character.inventory.length}`} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  let character = enemyData;

  if (hp < 1) {
    return <></>;
  }

  return (
    <>
      <Paper
        onClick={toggleDrawer('right', true)}
        sx={{
          textAlign: 'end',
          padding: '1em',
          borderRadius: '0.25rem',
          background: 'rgba(0,0,0,0.5)',
          color: '#fde7e7'
        }}
      >
        <Typography>{character.name}</Typography>
        <Typography>
          <GiHealthPotion /> {hp} / {enemyData.constitution * 10}
        </Typography>
      </Paper>
      <Drawer
        anchor="right"
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        {list('right')}
      </Drawer>
    </>
  );
}
