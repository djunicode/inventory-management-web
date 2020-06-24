/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Tab,
  withStyles,
  Tabs,
  Box,
  Badge,
} from '@material-ui/core/';
import { PropTypes } from 'prop-types';
import InventoryTable from './InventoryTable';
import ExpiryTable from './ExpiryTable';
import { ExpiryListContext } from '../ExpiryListContext';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      height: '1rem',
      borderRadius: '2px',
      maxWidth: '3rem',
      width: '100%',
      backgroundColor: '#495d69',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: '#000',
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(24),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))(props => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box py={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles(() => ({
  heading: {
    fontWeight: '700',
  },
  badge: {
    '& .MuiBadge-badge': {
      top: '50%',
      right: '-12%',
      color: 'black',
      backgroundColor: '#f2c94c',
    },
  },
}));

export default function Inventory() {
  // index of current tab
  const [tab, setTab] = useState(0);

  const classes = useStyles();

  const { expiryListBadge } = useContext(ExpiryListContext);

  // set the tab to new index
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography variant='h3' className={classes.heading} gutterBottom>
        Inventory
      </Typography>
      <StyledTabs value={tab} onChange={handleTabChange}>
        <StyledTab label='All' />
        <StyledTab
          style={{ paddingRight: '2rem' }}
          label={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Badge
              badgeContent={expiryListBadge}
              color='primary'
              overlap='circle'
              className={classes.badge}
            >
              Near expiry
            </Badge>
          }
        />
      </StyledTabs>
      <TabPanel value={tab} index={0}>
        <InventoryTable />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Typography variant='h6' gutterBottom>
          Items which expire in the next 3 days are displayed here
        </Typography>
        <ExpiryTable />
      </TabPanel>
    </div>
  );
}
