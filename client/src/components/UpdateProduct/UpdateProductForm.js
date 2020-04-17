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
import useForm from './useUpdateProductForm';

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
}));

const UpdateProduct = () => {
  // get state from location
  const location = useLocation();
  const { name, sellingPrice, id, loose } = location.state;
  // Use custom hook for form state management
  const { handleChange, handleSubmit, error, values } = useForm({
    name,
    sellingPrice,
    loose,
    id,
  });

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant='h4' className={classes.heading}>
        Update Product
      </Typography>
      <form
        noValidate
        onSubmit={handleSubmit}
        autoComplete='off'
        className={classes.gridContainer}
      >
        <Divider />
        <Typography variant='h5' className={classes.formHeading}>
          Product
        </Typography>
        <div className={classes.form}>
          <TextField
            required
            variant='filled'
            id='name-input'
            name='name'
            label='Name'
            value={values.name}
            onChange={handleChange}
            error={!(error.name === ' ')}
            helperText={error.name}
          />
          <TextField
            required
            variant='filled'
            id='sellingPrice-input'
            type='number'
            name='sellingPrice'
            label='Selling Price'
            InputProps={{
              inputProps: {
                min: 0,
              },
            }}
            value={values.sellingPrice}
            onChange={handleChange}
            error={!(error.sellingPrice === ' ')}
            helperText={error.sellingPrice}
          />
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Type</FormLabel>
            <RadioGroup
              name='loose'
              value={values.loose}
              onChange={handleChange}
              className={classes.radio}
            >
              <FormControlLabel
                value='true'
                control={<Radio />}
                label='Loose'
              />
              <FormControlLabel
                value='false'
                control={<Radio />}
                label='Packed'
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
  );
};

export default UpdateProduct;
