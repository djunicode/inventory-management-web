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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

  const theme = useTheme();
  // true if in tablet mode
  const tablet = useMediaQuery(theme.breakpoints.only('sm'));
  const isLoggedIn = location.pathname !== '/login';
  const classes = useStyles(isLoggedIn);

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

          <AlertDialog />
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

// Confirms user logut.
function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  // used to check current url
  const location = useLocation();
  // used to programmatically change url
  const history = useHistory();
  // true if in tablet mode

  const isLoggedIn = location.pathname !== '/login';

  // function to handle logout
  // token is passed in header to server and then removed from localStorage
  // then user is redirected to login page
  const handleClick = async () => {
    if (isLoggedIn) {
      try {
        const data = '';
        await axios.post('/auth/token/logout', data);
        localStorage.removeItem('token');
        localStorage.removeItem('isStaff');
      } catch (error) {
        console.log(error);
      }
    }
    history.push('/login');
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          {' '}
          <Button color='inherit' onClick={handleClickOpen}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              Are you sure you wish to logout?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                If you Agree, you will be logged out from all devices...
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Disagree
              </Button>
              <Button onClick={handleClick} color='primary' autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : null}
    </div>
  );
}
