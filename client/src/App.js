import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider, CssBaseline } from '@material-ui/core';
import Routes from './components/Routes';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4796bd',
    },
    background: {
      default: '#f3f9fb',
    },
  },
  typography: {
    fontFamily: [
      'Lato',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  spacing: factor => `${0.5 * factor}rem`,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
