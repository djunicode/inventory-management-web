/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import NavBar from './NavBar/NavBar';
import Login from './Login/Login';
import NavDrawer from './Drawer/Drawer';
import Container from './Container/Container';
import PageNotFound from './PageNotFound';
import UnAuthorizedAccess from './UnAuthorizedAccess';
import ExpiryListContextProvider from './ExpiryListContext';

const Routes = () => {
  // Using state so that navbar can communicate with drawer
  // mobileOpen will be used for screen width less than 600px
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // tabletOpen will be used for screen width between 960px and 600px
  const [tabletOpen, setTabletOpen] = React.useState(false);
  // All the routes of our app, excluding login
  const allRoutes = [
    '/',
    '/inventory',
    '/transaction',
    '/employee',
    '/addemployee',
    '/updateproduct',
    '/updateemployee',
  ];

  return (
    <Router>
      <ExpiryListContextProvider>
        <Switch>
          {/* Route handling for login */}
          <PrivateRoute exact path='/login'>
            <NavBar
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              tabletOpen={tabletOpen}
              setTabletOpen={setTabletOpen}
            />
            <Login />
          </PrivateRoute>
          {/* Route handling for all routes in allRoutes variable */}
          <PrivateRoute exact path={allRoutes}>
            <NavBar
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              tabletOpen={tabletOpen}
              setTabletOpen={setTabletOpen}
            />
            <NavDrawer
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              tabletOpen={tabletOpen}
            />
            <Container tabletOpen={tabletOpen} />
          </PrivateRoute>
          <Route path='/unauthorized' component={UnAuthorizedAccess} />
          <Route component={PageNotFound} />
        </Switch>
      </ExpiryListContextProvider>
    </Router>
  );
};

// Private Route Component
// eslint-disable-next-line consistent-return
const PrivateRoute = ({ children, path, ...rest }) => {
  const tokenExists = !!localStorage.getItem('token');

  // User cannot directly open homepage if token doesnt exist in local Storage.
  // It aslo redirects the user to login page

  if (path !== '/login') {
    return (
      <Route
        path={path}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        render={({ location }) =>
          tokenExists ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  }

  // User cannot directly open login page if token exists in local Storage.
  // It aslo redirects the user to homepage

  if (path === '/login') {
    return (
      <Route
        path={path}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        render={({ location }) =>
          tokenExists ? (
            <Redirect
              to={{
                pathname: '/',
                state: { from: location },
              }}
            />
          ) : (
            children
          )
        }
      />
    );
  }
};

PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired,
  ]),
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default Routes;
