import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  makeStyles,
  Button,
  InputAdornment,
  IconButton,
  Hidden,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import illustration from '../../images/Login.svg';
import useForm from './useForm';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  formContainer: {
    flex: '1 1 30rem',
    height: '26rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    padding: theme.spacing(0, 5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2),
    },
    '& .MuiTextField-root': {
      marginTop: theme.spacing(1),
      width: '100%',
      maxWidth: '20rem',
      [theme.breakpoints.down('xs')]: {
        maxWidth: '15rem',
      },
    },
  },
  paper: {
    maxWidth: '70rem',
    height: '35rem',
    margin: theme.spacing(2),
    marginTop: '6rem',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      width: '30rem',
      height: '38rem',
      alignItems: 'flex-start',
    },
  },
  img: {
    flex: '1 1 35rem',
    maxWidth: '50%',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '15rem',
      marginBottom: theme.spacing(2),
    },
  },
  heading: {
    fontWeight: '700',
    marginBottom: theme.spacing(4),
  },
  button: {
    width: '100%',
    maxWidth: '18rem',
    height: '3rem',
    borderRadius: '2rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginTop: theme.spacing(1.5),
    textTransform: 'capitalize',
    boxShadow: '0 5px 65px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '12rem',
    },
  },
  invalid: {
    display: props => (props.invalid ? 'block' : 'none'),
  },
}));

const Login = () => {
  // Use custom hook for form state management
  const {
    handleChange,
    handleSubmit,
    error,
    isInvalidCred,
    values,
    showPassword,
    toggleShowPassword,
  } = useForm();

  const classes = useStyles({ invalid: isInvalidCred });

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Hidden xsDown>
          <img
            src={illustration}
            alt='Login illustration'
            className={classes.img}
          />
        </Hidden>
        <div className={classes.formContainer}>
          <Typography variant='h3' className={classes.heading}>
            Login
          </Typography>
          <Hidden smUp>
            <img
              src={illustration}
              alt='Login illustration'
              className={classes.img}
            />
          </Hidden>
          <Typography variant='h6' color='error' className={classes.invalid}>
            Invalid email or password. Please try again
          </Typography>
          <form
            noValidate
            onSubmit={handleSubmit}
            autoComplete='off'
            className={classes.form}
          >
            <TextField
              required
              variant='filled'
              id='email-input'
              name='email'
              type='email'
              label='Email'
              value={values.email}
              onChange={handleChange}
              error={!(error.email === ' ')}
              helperText={error.email}
            />
            <TextField
              required
              variant='filled'
              id='password-input'
              name='password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              value={values.password}
              onChange={handleChange}
              error={!(error.password === ' ')}
              helperText={error.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={toggleShowPassword} tabIndex='-1'>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type='submit'
              color='primary'
              variant='contained'
              className={classes.button}
              data-testid='submit'
            >
              Login
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
};

export default Login;
