import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  const user = data?.me || data?.user || {};
  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user?.username) {
    return (
      <Typography variant="h3">
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </Typography>
    );
  }

  const characters = user.character;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="body1">Username: {user.username}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>

      <TableContainer sx={{ maxWidth: '75%', marginTop: 5 }} component={Paper}>
        <Table aria-label="User Characters">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              {characters.map((character) => (
                <>
                  <StyledTableCell key={'Name ' + character.name} align="right">
                    {character.name}
                  </StyledTableCell>
                </>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>Level</StyledTableCell>
              {characters.map((row) => (
                <StyledTableCell align="right" key={'Level ' + row.name}>
                  {row.level}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>XP</StyledTableCell>
              {characters.map((row) => (
                <StyledTableCell align="right" key={'XP ' + row.name}>
                  {row.xp}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Gold</StyledTableCell>
              {characters.map((row) => (
                <StyledTableCell align="right" key={'Gold ' + row.name}>
                  {row.gold}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Strength</StyledTableCell>
              {characters.map((row) => (
                <StyledTableCell align="right" key={'STR ' + row.name}>
                  {row.strength}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Defense</StyledTableCell>
              {characters.map((row) => (
                <StyledTableCell align="right" key={'DEF ' + row.name}>
                  {row.defense}
                </StyledTableCell>
              ))}
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Constitution</StyledTableCell>
              {characters.map((row) => (
                <StyledTableCell align="right" key={'CON ' + row.name}>
                  {row.constitution}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Profile;
