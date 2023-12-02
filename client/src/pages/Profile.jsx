import { Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { NEW_CHARACTER } from '../utils/mutations';

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
  Typography,
  Button,
  TextField,
  Modal
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { useState } from 'react';

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

  const [createCharacter] = useMutation(NEW_CHARACTER);

  const handleSaveCharacter = async () => {
    const characterData = {
      name: newCharacterName
    };

    try {
      const { data } = await createCharacter({
        variables: { characterData },
      });

      const savedCharacter = data.saveCharacter;

      console.log('Saved character:', savedCharacter);
    } catch (err) {
      console.error('Error saving character:', err);
    }
  };

  const [open, setOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (!newCharacterName) {
      return;
    }
    handleSaveCharacter();
    setNewCharacterName('');
  }

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

  console.log('user:', user);
  const characters = user.character;
  console.log('characters:', characters);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="body1">Username: {user.username}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>

      {/* Character Display Table */}
      <TableContainer sx={{ maxWidth: '75%', my: 5 }} component={Paper}>
        <Table aria-label="User Characters">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Level</StyledTableCell>
              <StyledTableCell>XP</StyledTableCell>
              <StyledTableCell>Gold</StyledTableCell>
              <StyledTableCell>Strength</StyledTableCell>
              <StyledTableCell>Defense</StyledTableCell>
              <StyledTableCell>Constitution</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {characters.map((character) => (
              <StyledTableRow key={character._id}>
                <StyledTableCell>{character.name}</StyledTableCell>
                <StyledTableCell align="right">{character.level}</StyledTableCell>
                <StyledTableCell align="right">{character.xp}</StyledTableCell>
                <StyledTableCell align="right">{character.gold}</StyledTableCell>
                <StyledTableCell align="right">{character.strength}</StyledTableCell>
                <StyledTableCell align="right">{character.defense}</StyledTableCell>
                <StyledTableCell align="right">{character.constitution}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Character Modal */}
      <Button variant="contained" onClick={handleOpen}>
        Create New Character
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexDirection: 'column'
          }}
        >
          <Typography variant="h3" sx={{ my: '5px' }}>Create New Character</Typography>
          <TextField
            id="outlined-basic"
            label="Character Name"
            variant="outlined"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            sx={{ my: '5px' }}
          />
          <Button variant="contained" onClick={handleClose} sx={{ my: '5px' }}>Create</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
