import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Hidden,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

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

const NavBar = ({ mobileOpen, setMobileOpen, tabletOpen, setTabletOpen }) => {
  // used to check current url
  const location = useLocation();
  // used to programmatically change url
  const history = useHistory();
  const theme = useTheme();
  // true if in tablet mode
  const tablet = useMediaQuery(theme.breakpoints.only('sm'));
  const isLoggedIn = location.pathname !== '/login';
  const classes = useStyles(isLoggedIn);

  // function to handle logout
  // token is passed in header to server and then removed from localStorage
  // then user is redirected to login page
  const handleClick = async () => {
    if (isLoggedIn) {
      try {
        const data = '';
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Token ${token}` } };
        await axios.post('/auth/token/logout', data, config);
        localStorage.removeItem('token');
        localStorage.removeItem('isStaff');
      } catch (error) {
        console.log(error);
      }
    }
    history.push('/login');
  };

  // handle opening and closing of drawer
  const handleDrawerToggle = () => {
    if (tablet) {
      setTabletOpen(!tabletOpen);
    } else {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position='fixed'>
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              onClick={handleDrawerToggle}
            >
              {tabletOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Hidden>
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

NavBar.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  tabletOpen: PropTypes.bool.isRequired,
  setMobileOpen: PropTypes.func.isRequired,
  setTabletOpen: PropTypes.func.isRequired,
};

export default NavBar;
