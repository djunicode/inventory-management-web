import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Home from '../Home/Home';
import Employee from '../Employee/Employee';
import Transaction from '../Transactions/Transaction';
import Inventory from '../Inventory/Inventory';

const drawerWidth = 230;

const useStyles = makeStyles(theme => ({
  container: {
    marginLeft: drawerWidth,
    [theme.breakpoints.only('sm')]: {
      marginLeft: props => (props.tab ? drawerWidth : '4.5rem'),
    },
    [theme.breakpoints.only('xs')]: {
      marginLeft: 0,
    },
  },
}));

const Container = ({ tabletOpen }) => {
  const classes = useStyles({ tab: tabletOpen });

  return (
    <div className={classes.container}>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/employee'>
          <Employee />
        </Route>
        <Route path='/transaction'>
          <Transaction />
        </Route>
        <Route path='/inventory'>
          <Inventory />
        </Route>
      </Switch>
    </div>
  );
};

Container.propTypes = {
  tabletOpen: PropTypes.bool.isRequired,
};

export default Container;
