import { Typography } from '@mui/material';
import { useState } from 'react';

export default function CombatMessage({ messageArray }) {
  if (messageArray.length > 2) {
    messageArray = messageArray.slice(
      messageArray.length - 2,
      messageArray.length
    );
  }
  return (
    <>
      {messageArray.map((message, index) => (
        <Typography key={index} variant="body1">
          {message}
        </Typography>
      ))}
    </>
  );
}
