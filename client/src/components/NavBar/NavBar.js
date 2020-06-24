import React, { useContext } from 'react';
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
  Badge,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import DialogBox from '../DialogBox/DialogBox';
import { postEndPoint } from '../UtilityFunctions/Request';
import { ExpiryListContext } from '../ExpiryListContext';

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
  tabBadge: {
    '& .MuiBadge-badge': {
      right: '-10%',
      color: 'black',
      backgroundColor: '#f2c94c',
    },
  },
}));

const NavBar = ({ mobileOpen, setMobileOpen, tabletOpen, setTabletOpen }) => {
  // used to check current url
  const location = useLocation();

  const theme = useTheme();
  // true if in tablet mode
  const tablet = useMediaQuery(theme.breakpoints.only('sm'));
  const mobile = useMediaQuery(theme.breakpoints.only('xs'));
  const isLoggedIn = location.pathname !== '/login';
  const classes = useStyles(isLoggedIn);

  const { expiryListBadge } = useContext(ExpiryListContext);

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
              {tabletOpen ? (
                <ChevronLeftIcon />
              ) : (
                <Badge
                  badgeContent={expiryListBadge}
                  color='primary'
                  overlap='circle'
                  className={classes.tabBadge}
                  invisible={!mobile}
                >
                  <MenuIcon />
                </Badge>
              )}
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
        await postEndPoint('/auth/token/logout', data, null, history);
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
          <DialogBox
            open={open}
            handleClose={handleClose}
            handleClick={handleClick}
            number='2'
          />
        </>
      ) : null}
    </div>
  );
}
