import { createTheme } from '@mui/material/styles';

// Create a theme instance.
let theme = createTheme({
  palette: {
    text: {
      main: '#180202'
    },
    background: {
      main: '#fafafa'
    },
    primary: {
      main: '#ff6d4d',
      textContrast: '#180202'
    },
    secondary: {
      main: '#e6e6e5',
      textContrast: '#180202'
    },
    accent: {
      main: '#d12600',
      textContrast: '#fafafa'
    }
  }
});

theme = createTheme(theme, {
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.textContrast
        }
      }
    }
  }
});

export default theme;
