import Auth from '../utils/auth';
import { useState } from 'react';
import { Link as RouterLink, useRouteError } from 'react-router-dom';
import {
  AppBar,
  Box,
  Avatar,
  Button,
  Menu,
  Toolbar,
  Container,
  IconButton,
  Typography,
  Tooltip,
  MenuItem,
  Link
} from '@mui/material';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GiImpLaugh } from 'react-icons/gi';

// const Header = () => {
//   const logout = (event) => {
//     event.preventDefault();
//     Auth.logout();
//   };
//   return (
//     <Box component="header">
//       <Container>
//         <Box>
//           <Link component={RouterLink} to="/">
//             <Typography variant="h1">The Roost</Typography>
//           </Link>
//           <Typography variant="h4">Chickens Await!</Typography>
//         </Box>
//         <Box>
//           {Auth.loggedIn() ? (
//             <>
//               <Link component={RouterLink} to="/me">
//                 {Auth.getProfile().data.username}&apos;s profile
//               </Link>
//               <Button onClick={logout}>
//                 Logout
//               </Button>
//             </>
//           ) : ''}
//         </Box>
//       </Container>
//     </Box>
//   );
// };

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Header() {
  const error = useRouteError();
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            The Roost
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Chicken Little"
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Link
                    component={RouterLink}
                    to={`/${setting}`}
                    textAlign="center"
                    underline="none"
                  >
                    {setting}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
