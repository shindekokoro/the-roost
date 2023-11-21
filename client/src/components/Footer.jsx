import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { GiAncientSword } from 'react-icons/gi';
import { GiMove } from 'react-icons/gi';
import { GiHeartShield } from 'react-icons/gi';

export default function Footer() {
  const [value, setValue] = useState(0);

  const iconStyle = { width: '2em', height: '2em' };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Attack"
          icon={<GiAncientSword style={iconStyle} />}
        />
        <BottomNavigationAction
          label="Move"
          icon={<GiMove style={iconStyle} />}
        />
        <BottomNavigationAction
          label="Defend"
          icon={<GiHeartShield style={iconStyle} />}
        />
      </BottomNavigation>
    </Paper>
  );
}
