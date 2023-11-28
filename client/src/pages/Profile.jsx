import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { Box, Grid, Typography } from '@mui/material';

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

  let character = user.character[0];
  return (
    <Box>
      <Typography variant="body1">Username: {user.username}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Grid container>
          <Grid item>
            <Typography variant="body2">Name: {character.name}</Typography>
            <Typography variant="body2">Level: {character.level}</Typography>
            <Typography variant="body2">Gold: {character.gold}</Typography>
            <Typography variant="body2">Experience: {character.xp}</Typography>
            <Typography variant="body2">Strength: {character.strength}</Typography>
            <Typography variant="body2">Defense: {character.defense}</Typography>
            <Typography variant="body2">Constitution: {character.constitution}</Typography>
          </Grid>;
      </Grid>
    </Box>
  );
};

export default Profile;
