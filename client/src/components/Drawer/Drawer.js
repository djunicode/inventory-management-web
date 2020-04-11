import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ListIcon from '@material-ui/icons/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const drawerWidth = 230;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  drawerPaper: {
    width: drawerWidth,
    zIndex: 0,
    [theme.breakpoints.only('sm')]: {
      width: props => (props.tab ? drawerWidth : '4.5rem'),
      overflowX: 'hidden',
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  link: {
    textDecoration: 'none',
  },
  icons: {
    fontSize: '2rem',
    color: theme.palette.primary.light,
  },
  listIcon: {
    minWidth: '2rem',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.only('sm')]: {
      marginRight: props => (props.tab ? theme.spacing(2) : theme.spacing(3)),
      marginLeft: props => (props.tab ? theme.spacing(1) : theme.spacing(0.5)),
    },
  },
  listText: {
    paddingTop: theme.spacing(0.5),
    '& .MuiTypography-body1': {
      fontSize: '1.25rem',
      color: theme.text.color.veryDark,
    },
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  toolbar: theme.mixins.toolbar,
}));

function NavDrawer({ mobileOpen, setMobileOpen, tabletOpen }) {
  const classes = useStyles({ tab: tabletOpen });

  // links and labels for each link in drawer
  const [list, setList] = useState({
    links: ['/', '/inventory', '/transaction'],
    labels: ['Home', 'Inventory', 'Transactions'],
  });

  // function to handle drawer state on mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // array of drawer icons
  const listIcons = [
    <HomeIcon className={classes.icons} />,
    <ListIcon className={classes.icons} />,
    <PersonIcon className={classes.icons} />,
    <ReceiptIcon className={classes.icons} />,
  ];

  useEffect(() => {
    // Add Admin protected links to the list only if isStaff is true
    const isAdmin = localStorage.getItem('isStaff');
    if (isAdmin === 'true') {
      setList({
        labels: ['Home', 'Inventory', 'Employees', 'Transactions'],
        links: ['/', '/inventory', '/employee', '/transaction'],
      });
    }
  }, []);

  const drawer = (
    <div>
      <List>
        {list.labels.map((text, index) => (
          <Link to={list.links[index]} className={classes.link} key={text}>
            <ListItem button key={text}>
              <ListItemIcon className={classes.listIcon}>
                {listIcons[index]}
              </ListItemIcon>
              <ListItemText primary={text} className={classes.listText} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden smUp>
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant='permanent'
          open
        >
          <div className={classes.toolbar} />
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

NavDrawer.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  tabletOpen: PropTypes.bool.isRequired,
  setMobileOpen: PropTypes.func.isRequired,
};

export default NavDrawer;
