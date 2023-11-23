import { createTheme } from '@mui/material/styles';

// Create a theme instance.
let theme = createTheme({
  palette: {
    text: {
      main: '#fde7e7'
    },
    background: {
      main: '#050505'
    },
    primary: {
      main: '#b32100',
      textContrast: '#fde7e7'
    },
    secondary: {
      main: '#1a1a19',
      textContrast: '#fde7e7'
    },
    accent: {
      main: '#ff542e',
      textContrast: '#050505'
    }
  }
});

theme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: theme.palette.text.main,
          backgroundImage: `url('../zombie_turkey_king.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPositionY: '52px',
          backgroundSize: 'cover'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.contrastText
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.contrastText,
          marginBottom: '5px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.contrastText
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              '& legend': {
                overflow: 'initial',
                textAlign: 'right',
                '& span': {
                  opacity: '100'
                }
              }
            }
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
          },
          '& .MuiOutlinedInput-input': {
            color: theme.palette.primary.contrastText
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.primary.contrastText,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.contrastText
          }
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.secondary.main
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.contrastText
        }
      }
    }
  }
});

export default theme;
