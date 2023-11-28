import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Button,
  FormControl,
  Grid,
  Link,
  OutlinedInput,
  Snackbar,
  Typography
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: ''
  });
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const [addUser, { error, data }] = useMutation(ADD_USER);
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState }
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  const [open, setOpen] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      {data ? (
        <Typography>
          Success! You may now head{' '}
          <Link component={RouterLink} to="/">
            back to the homepage.
          </Link>
        </Typography>
      ) : (
        <Grid container>
          <form onSubmit={handleFormSubmit}>
            <Grid item>
              <FormControl variant="filled" size="small">
                <OutlinedInput
                  placeholder="Your username"
                  id="username-input"
                  type="text"
                  name="username"
                  label="Username"
                  defaultValue={formState.name}
                  onChange={handleChange}
                ></OutlinedInput>
              </FormControl>
              <br />
              <FormControl variant="filled" size="small">
                <OutlinedInput
                  placeholder="Your email"
                  id="email-input"
                  type="email"
                  name="email"
                  label="E-Mail"
                  defaultValue={formState.email}
                  onChange={handleChange}
                ></OutlinedInput>
              </FormControl>
              <br />
              <FormControl variant="filled" size="small">
                <OutlinedInput
                  placeholder="Your Password"
                  id="password-input"
                  type="password"
                  name="password"
                  label="Password"
                  defaultValue={formState.password}
                  onChange={handleChange}
                ></OutlinedInput>
              </FormControl>
            </Grid>
            <Grid item>
              <Button type="submit" variant="outlined">
                Submit
              </Button>
            </Grid>
          </form>
        </Grid>
      )}

      {error && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          sx={{ position: 'fixed', bottom: 90 }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Signup;
