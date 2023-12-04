import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import { LOGIN_USER, ADD_USER } from '../utils/mutations';
import { Signup } from '../components';
import Auth from '../utils/auth';

const Login = ({ signup }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    signup = !signup
  },[pathname]);

  const [login, { error: loginError, data: loginData }] =
    useMutation(LOGIN_USER);
  const [addUser, { error: signupError, data: signupData }] =
    useMutation(ADD_USER);
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: ''
  });
  const error = loginError || signupError || false;
  const data = loginData || signupData;

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = signup
        ? await addUser({
            variables: { ...formState }
          })
        : await login({
            variables: { ...formState }
          });

      Auth.login(data.login?.token || data.addUser?.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      username: '',
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
              {signup ? (
                <Signup formState={formState} handleChange={handleChange} />
              ) : (
                ''
              )}
              <br />
              <FormControl variant="filled" size="small">
                <OutlinedInput
                  placeholder="Your email"
                  id="email-input"
                  type="email"
                  name="email"
                  label="E-Mail"
                  value={formState.email}
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
                  value={formState.password}
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
              {!signup ? (
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="outlined"
                >
                  Signup
                </Button>
              ) : (
                ''
              )}
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

export default Login;
