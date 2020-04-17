import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  makeStyles,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import useForm from './useRegisterForm';

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

const Register = () => {
  // Use custom hook for form state management
  const {
    handleChange,
    handleSubmit,
    error,
    invalidCred,
    values,
    showConfirmPassword,
    showPassword,
    toggleShowPassword,
    toggleShowconfirmPassword,
  } = useForm();

  const classes = useStyles({ invalid: invalidCred });

  return (
    <Paper className={classes.paper}>
      <Typography variant='h4' className={classes.heading}>
        Add New Employee
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
          <TextField
            required
            variant='filled'
            id='confirm-password-input'
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            label='Confirm Password'
            value={values.confirmPassword}
            onChange={handleChange}
            error={!(error.confirmPassword === ' ')}
            helperText={error.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={toggleShowconfirmPassword} tabIndex='-1'>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            variant='filled'
            id='gender-input'
            name='gender'
            select
            label='Employee Gender'
            value={values.gender}
            onChange={handleChange}
            error={!(error.gender === ' ')}
            helperText={error.gender}
          >
            {['Male', 'Female', 'Other'].map((option, index) => (
              <MenuItem key={option} value={['M', 'F', 'Other'][index]}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
                value='true'
                control={<Radio />}
                label='Manager'
              />
              <FormControlLabel
                value='false'
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
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
