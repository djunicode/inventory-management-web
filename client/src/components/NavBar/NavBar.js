import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    display: isLoggedIn => (isLoggedIn ? 'block' : 'none'),
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    textDecoration: 'none',
    textTransform: 'capitalize',
    fontSize: '1rem',
  },
}));

const NavBar = () => {
  const location = useLocation();
  const history = useHistory();
  const isLoggedIn = location.pathname !== '/login';
  const classes = useStyles(isLoggedIn);

  const handleClick = async () => {
    if (isLoggedIn) {
      try {
        const data = '';
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Token ${token}` } };
        await axios.post('/auth/token/logout', data, config);
        localStorage.removeItem('token');
      } catch (error) {
        console.log(error);
      }
    }
    history.push('/login');
  };

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            Inventory Management Web App
          </Typography>
          <Button
            color='inherit'
            className={classes.button}
            onClick={handleClick}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
