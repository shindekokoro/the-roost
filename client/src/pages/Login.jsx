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
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Login = (props) => {
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const [formState, setFormState] = useState({ email: '', password: '' });

  // update state based on form input changes

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState }
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: ''
    });
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
            <Grid item alignItems="stretch">
              <Button
                type="submit"
                variant="outlined"
                sx={{ marginRight: '5px' }}
              >
                Submit
              </Button>
              <Button component={RouterLink} to="/signup" variant="outlined">
                Signup
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
          sx={{ bottom: 90 }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Login;
