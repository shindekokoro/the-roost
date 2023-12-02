import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

import { QUERY_USERS } from '../utils/queries';

import {
  Typography,
  Container,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Table,
  Paper,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.textContrast
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const FadingBox = ({ showLoading, children }) => (
  <Fade in={showLoading} timeout={4000}>
    <Box style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '40vh',
      }}
    >
      {children}
    </Box>
  </Fade>
)

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const { loading, data } = useQuery(QUERY_USERS);

  if (showLoading || loading) {
    return (
      <FadingBox showLoading={showLoading}>
        <Typography variant="h3" color="white" sx={{
          fontWeight: 'bold',
          fontSize: '2rem',
          backgroundColor: '#b22100',
          borderRadius: '10px',
          padding: '10px',
        }}>
          Loading High Scores...
        </Typography>
        <CircularProgress sx={{ mt: '10px' }} />
      </FadingBox>
    )
  };

  const usersWithCharacters = (data.users || []).filter(user => {
    return user.character && user.character.length > 0;
  });

  const sortedUsers = usersWithCharacters.sort((a, b) => {
    const aLevel = Math.max(...a.character.map(character => character.level || 0));
    const bLevel = Math.max(...b.character.map(character => character.level || 0));

    return bLevel - aLevel;
  });

  return (
    <Container align="center" sx={{ display: 'flex', justifyContent: 'center', mt: '10%' }}>
      <TableContainer sx={{ maxWidth: '75%', marginTop: 5, borderRadius: '15px', boxShadow: 15 }} component={Paper}>
        <Table aria-label="High Scores">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={4} component="th" scope="row" sx={{
                borderBottom: 'none',
              }}>
                <Typography variant="h4">
                  Current High Scores
                </Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell align="center" sx={{ width: '33.33%' }}>
                Username
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: '33.33%' }}>
                Character Name
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: '33.33%' }}>
                Character Level
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <StyledTableRow key={user._id}>
                <StyledTableCell align="center" component="th" scope="row">
                  {user.username}
                </StyledTableCell>
                <StyledTableCell align="center">{user.character[0].name}</StyledTableCell>
                <StyledTableCell align="center">{user.character[0].level}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

