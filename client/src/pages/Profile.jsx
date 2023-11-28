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

  return (
    <Box>
      <Typography variant="body1">Username: {user.username}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Grid container>
        {user.character.map((avatar) => {
          <Grid item>
            <Typography variant="body2">Name: {avatar.name}</Typography>
            <Typography variant="body2">Level: {avatar.level}</Typography>
            <Typography variant="body2">Gold: {avatar.gold}</Typography>
            <Typography variant="body2">Experience: {avatar.xp}</Typography>
            <Typography variant="body2">Strength: {avatar.strength}</Typography>
            <Typography variant="body2">Defense: {avatar.defense}</Typography>
            <Typography variant="body2">Constitution: {avatar.constitution}</Typography>
          </Grid>;
        })}
      </Grid>
    </Box>
  );
};

export default Profile;
