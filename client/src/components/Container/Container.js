import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch, Redirect } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Home from '../Home/Home';
import Employee from '../Employee/Employee';
import Transaction from '../Transactions/Transaction';
import Inventory from '../Inventory/Inventory';
import Register from '../Register/Register';
import UpdateProduct from '../UpdateProduct/UpdateProductForm';
import SimpleSnackbar from '../SnackBar/Snackbar';
import SnackContextProvider from '../SnackBar/SnackContext';
import UpdateEmployee from '../UpdateEmployee/UpdateEmployeeForm';

const drawerWidth = 230;

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(5),
    paddingTop: theme.spacing(13),
    marginLeft: drawerWidth,
    [theme.breakpoints.only('sm')]: {
      marginLeft: props => (props.tab ? drawerWidth : '4.5rem'),
    },
    [theme.breakpoints.only('xs')]: {
      marginLeft: 0,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
}));

const Container = ({ tabletOpen }) => {
  const classes = useStyles({ tab: tabletOpen });

  return (
    <div className={classes.container}>
      <SnackContextProvider>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <AdminRoute path='/employee'>
            <Employee />
          </AdminRoute>
          <Route path='/transaction'>
            <Transaction />
          </Route>
          <Route path='/inventory'>
            <Inventory />
          </Route>
          <Route path='/updateproduct'>
            <UpdateProduct />
          </Route>
          <Route path='/updateemployee'>
            <UpdateEmployee />
          </Route>
          <AdminRoute path='/addemployee'>
            <Register />
          </AdminRoute>
        </Switch>
        <SimpleSnackbar />
      </SnackContextProvider>
    </div>
  );
};

// Admin Route Component
const AdminRoute = ({ children, path, ...rest }) => {
  const isAdmin = localStorage.getItem('isStaff');

  // User cannot directly open respective page if user is not an admin.
  // It also redirects the user to home page

  return (
    <Route
      path={path}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={
        ({ location }) =>
          isAdmin ? (
            children
          ) : (
            <Redirect to={{ pathname: '/', state: { from: location } }} />
          )
        // eslint-disable-next-line react/jsx-curly-newline
      }
    />
  );
};

AdminRoute.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired,
  ]).isRequired,
  path: PropTypes.string.isRequired,
};

Container.propTypes = {
  tabletOpen: PropTypes.bool.isRequired,
};

export default Container;
