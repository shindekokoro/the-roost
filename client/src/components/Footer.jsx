import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import {
  GiAncientSword,
  GiMove,
  GiHeartShield,
  GiEvilHand
} from 'react-icons/gi';
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa6';
import { GrRun } from 'react-icons/gr';
import { RiErrorWarningFill } from 'react-icons/ri';

export default function Footer({ options, eventResult, combatResult }) {
  const [value, setValue] = useState(0);
  const iconStyle = { width: '2em', height: '2em' };

  const getIcon = (description) => {
    console.log(description);
    switch (description) {
      case 'Move Left':
        return <FaArrowLeft style={iconStyle} />;
      case 'Move Right':
        return <FaArrowRight style={iconStyle} />;
      case 'Move Forward':
        return <FaArrowUp style={iconStyle} />;
      case 'Move Back':
        return <FaArrowDown style={iconStyle} />;
      case 'Attack':
        return <GiAncientSword style={iconStyle} />;
      case 'Defend':
        return <GiHeartShield style={iconStyle} />;
      case 'Interact':
        return <GiEvilHand style={iconStyle} />;
      case 'Run!':
      case 'Run away':
        return <GrRun style={iconStyle} />;
      default:
        return <RiErrorWarningFill style={iconStyle} />;
    }
  };

  console.log(options);

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
        {options.map((option, index) => (
          <BottomNavigationAction
            key={index}
            onClick={
              eventResult
                ? () => eventResult(JSON.stringify(option.result))
                : () => combatResult(option.description)
            }
            icon={getIcon(option.description)}
            label={option.description}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
