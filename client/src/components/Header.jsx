import Auth from '../utils/auth';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Avatar,
  Menu,
  Toolbar,
  Container,
  IconButton,
  Typography,
  Tooltip,
  MenuItem,
  Link
} from '@mui/material';

const getTitle = (path) => {
  switch (path) {
    case '/':
      return 'The Roost';
    case '/Login':
      return 'Login';
    case '/Signup':
      return 'Signup';
    default:
      return 'Error';
  }
};

export default function Header() {
  const currentPage = useLocation().pathname;
  const title = getTitle(currentPage);

  // Logout user and redirect to home route
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    window.location.href = './';
  };
  // Set Menu State and Navigation Elements
  const userSettings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              // display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {title}
          </Typography>
          {console.log(Auth.getProfile.data)}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip
              title={
                Auth.loggedIn()
                  ? `${Auth.getProfile().data.username}'s settings`
                  : 'Login'
              }
            >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={
                    Auth.loggedIn() ? Auth.getProfile().data.username : 'Login'
                  }
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {Auth.loggedIn() ? (
                userSettings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Link
                      component={RouterLink}
                      to={`/${setting}`}
                      textAlign="center"
                      underline="none"
                      onClick={setting === 'Logout' ? logout : ''}
                    >
                      {setting}
                    </Link>
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link
                    component={RouterLink}
                    to={`/Login`}
                    textAlign="center"
                    underline="none"
                  >
                    Login
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
