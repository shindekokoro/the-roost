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
        <Typography
          key={index}
          variant="body1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: '0.25rem',
            background: 'rgba(0,0,0,0.5)',
            marginBottom: '1em',
            padding: 1
          }}
          color={index % 2 ? '#ff542e' : '#fde7e7'}
        >
          {message}
        </Typography>
      ))}
    </>
  );
}
