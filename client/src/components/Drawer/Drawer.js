import React, { useState, useEffect, useContext } from 'react';
import {
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ListIcon from '@material-ui/icons/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { getEndPoint } from '../UtilityFunctions/Request';
import { ExpiryListContext } from '../ExpiryListContext';

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
  badge: {
    '& .MuiBadge-badge': {
      top: '55%',
      right: '-15%',
      color: 'black',
      backgroundColor: '#f2c94c',
    },
  },
  tabBadge: {
    '& .MuiBadge-badge': {
      right: '-10%',
      color: 'black',
      backgroundColor: '#f2c94c',
    },
  },
}));

function NavDrawer({ mobileOpen, setMobileOpen, tabletOpen }) {
  const classes = useStyles({ tab: tabletOpen });
  const theme = useTheme();
  // true if in tablet mode
  const tablet = useMediaQuery(theme.breakpoints.only('sm'));

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

  const { expiryListBadge, setExpiryListBadge, update } = useContext(
    ExpiryListContext
  );

  const history = useHistory();

  const apiFetch = async () => {
    try {
      const response = await getEndPoint('/api/explist/', null, history);
      const { data } = response;
      setExpiryListBadge(data.count);
    } catch (e) {
      console.log(e);
    }
  };

  // call API on component load
  useEffect(() => {
    apiFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const drawer = (
    <div>
      <List>
        {list.labels.map((text, index) => (
          <Link
            to={list.links[index]}
            className={classes.link}
            key={text}
            onClick={handleDrawerToggle}
          >
            <ListItem button key={text}>
              <ListItemIcon className={classes.listIcon}>
                <Badge
                  badgeContent={expiryListBadge}
                  color='primary'
                  overlap='circle'
                  className={classes.tabBadge}
                  invisible={!(text === 'Inventory' && !tabletOpen && tablet)}
                >
                  {listIcons[index]}
                </Badge>
              </ListItemIcon>
              <Badge
                badgeContent={expiryListBadge}
                color='primary'
                overlap='circle'
                className={classes.badge}
                invisible={text !== 'Inventory'}
              >
                <ListItemText primary={text} className={classes.listText} />
              </Badge>
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
