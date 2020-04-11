/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Tab, withStyles, Tabs, Box } from '@material-ui/core/';
import { PropTypes } from 'prop-types';
import Form from './TransactionForm';
import TransactionHistory from './TransactionHistory';

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

const useStyles = makeStyles(theme => ({
  root: {},
  button: {
    width: theme.spacing(20),
    marginLeft: theme.spacing(55),
    borderRadius: 20,
  },
  subHeading: {
    marginTop: 20,
    textAlign: 'center',
  },
  links: {
    flexGrow: 1,
    marginTop: 25,
  },
  heading: {
    fontWeight: 'bold',
  },
}));

export default function Transaction() {
  // index of current tab
  const [tab, setTab] = useState(0);

  const classes = useStyles();

  // set the tab to new index
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography variant='h3' className={classes.heading} gutterBottom>
        Transactions
      </Typography>
      <StyledTabs value={tab} onChange={handleTabChange}>
        <StyledTab label='Buy' />
        <StyledTab label='Sell' />
        <StyledTab label='History' />
      </StyledTabs>
      <TabPanel value={tab} index={0}>
        <Form type='Buy' />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Form type='Sell' />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <TransactionHistory />
      </TabPanel>
    </div>
  );
}
