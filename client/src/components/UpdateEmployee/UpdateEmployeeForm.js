import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  makeStyles,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import useForm from './useUpdateEmployeeForm';
import Spinner from '../Spinner';

const useStyles = makeStyles(theme => ({
  paper: {
    textAlign: 'center',
    padding: theme.spacing(4),
    borderRadius: '10px',
    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
    [theme.breakpoints.only('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(120px,1fr) minmax(300px,2fr)',
    '& > .MuiDivider-root': {
      width: '60%',
      gridColumn: 'span 2',
      justifySelf: 'center',
      [theme.breakpoints.only('xs')]: {
        margin: '0 auto',
      },
    },
    [theme.breakpoints.only('xs')]: {
      display: 'block',
    },
  },
  formHeading: {
    marginTop: theme.spacing(3),
    textAlign: 'right',
    [theme.breakpoints.only('sm')]: {
      textAlign: 'center',
    },
    [theme.breakpoints.only('xs')]: {
      textAlign: 'left',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    '& .MuiTextField-root': {
      width: '100%',
      maxWidth: '20rem',
    },
    '& > *': {
      margin: theme.spacing(1),
    },
    '& > :first-child': {
      marginTop: 0,
    },
  },
  heading: {
    fontWeight: '700',
    marginBottom: theme.spacing(2.5),
  },
  button: {
    gridColumn: 'span 2',
    justifySelf: 'center',
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
  radio: {
    display: 'flex',
    flexDirection: 'row',
  },
  invalid: {
    display: props => (props.invalid === '' ? 'none' : 'block'),
  },
}));

const UpdateEmployee = () => {
  // get state from location
  const location = useLocation();
  const { firstName, lastName, age, isStaff, email } = location.state;
  // Use custom hook for form state management
  const {
    handleChange,
    handleSubmit,
    error,
    invalidCred,
    values,
    isLoading,
  } = useForm({ firstName, lastName, age, isStaff, email });

  const classes = useStyles({ invalid: invalidCred });

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <Paper className={classes.paper}>
        <Typography variant='h4' className={classes.heading}>
          User Update
        </Typography>
        <Typography
          variant='h6'
          color='error'
          className={classes.invalid}
          gutterBottom
        >
          {invalidCred}
        </Typography>
        <form
          noValidate
          onSubmit={handleSubmit}
          autoComplete='off'
          className={classes.gridContainer}
        >
          <Divider />
          <Typography variant='h5' className={classes.formHeading}>
            Account
          </Typography>
          <div className={classes.form}>
            <TextField
              disabled
              variant='filled'
              id='email-input'
              name='email'
              type='email'
              label='Email'
              value={email}
              onChange={handleChange}
              helperText={' '}
            />
            <TextField
              required
              variant='filled'
              id='last-name-input'
              name='firstName'
              label='First Name'
              value={values.firstName}
              onChange={handleChange}
              error={!(error.firstName === ' ')}
              helperText={error.firstName}
            />
            <TextField
              required
              variant='filled'
              id='first-name-input'
              name='lastName'
              label='Last Name'
              value={values.lastName}
              onChange={handleChange}
              error={!(error.lastName === ' ')}
              helperText={error.lastName}
            />
            <TextField
              required
              variant='filled'
              id='age-input'
              name='age'
              type='number'
              label='Employee Age'
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              value={values.age}
              onChange={handleChange}
              error={!(error.age === ' ')}
              helperText={error.age}
            />
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Type</FormLabel>
              <RadioGroup
                name='isStaff'
                value={values.isStaff}
                onChange={handleChange}
                className={classes.radio}
              >
                <FormControlLabel
                  value='True'
                  control={<Radio />}
                  label='Manager'
                />
                <FormControlLabel
                  value='False'
                  control={<Radio />}
                  label='Employee'
                />
              </RadioGroup>
            </FormControl>
          </div>
          <Button
            type='submit'
            color='primary'
            variant='contained'
            className={classes.button}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default UpdateEmployee;
