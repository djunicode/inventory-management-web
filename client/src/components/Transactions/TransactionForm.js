import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { PropTypes } from 'prop-types';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import useForm from './useTransactionForm';
import Spinner from '../Spinner';

const filter = createFilterOptions();

const useStyles = makeStyles(theme => ({
  paper: {
    textAlign: 'center',
    padding: theme.spacing(4),
    borderRadius: '10px',
    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
    [theme.breakpoints.only('sm')]: {
      padding: theme.spacing(2),
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
  addProduct: {
    width: theme.typography.pxToRem(165),
    justifySelf: 'center',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paperHeading: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
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
  productDetails: {
    marginBottom: '2rem',
    maxWidth: '20rem',
  },
  button: {
    gridColumn: 'span 2',
    justifySelf: 'center',
    width: '100%',
    maxWidth: '12rem',
    height: '3rem',
    borderRadius: '2rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginTop: theme.spacing(1.5),
    textTransform: 'capitalize',
    boxShadow: '0 5px 65px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '12rem',
      display: 'flex',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
}));

const Form = ({ type }) => {
  const classes = useStyles({ buy: type });

  // Use custom hook for form state management
  const {
    customer,
    values,
    error,
    handleChange,
    handleSubmit,
    productsList,
    handleAddProduct,
    handleProductChange,
    productDetails,
    isLoading,
    handleSearch,
    handleChangeCustomer,
  } = useForm(type);

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <div>
        <Paper className={classes.paper}>
          <Typography variant='h4' className={classes.paperHeading}>
            {type} Items
          </Typography>
          <form
            noValidate
            onSubmit={handleSubmit}
            autoComplete='off'
            className={classes.gridContainer}
          >
            {customer.map((value, index) => (
              <>
                <Divider />
                <Typography variant='h5' className={classes.formHeading}>
                  Customer {values.length > 1 ? index + 1 : ''}
                </Typography>
                <div className={classes.form}>
                  <TextField
                    required
                    variant='filled'
                    id='customerName'
                    name='customerName'
                    type='text'
                    label='Name'
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    value={customer.customerName}
                    onChange={event => handleChangeCustomer(event, index)}
                    error={!(error[index].customerName === ' ')}
                    helperText={error[index].customerName}
                  />
                  <TextField
                    variant='filled'
                    id='phone-input'
                    name='customerPhone'
                    type='number'
                    label='Phone Number'
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    value={customer.customerPhone}
                    onChange={event => handleChangeCustomer(event, index)}
                    error={!(error[index].customerPhone === ' ')}
                    helperText={error[index].customerPhone}
                  />
                  <TextField
                    variant='filled'
                    id='address-input'
                    name='customerAddress'
                    type='text'
                    label='Address'
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    value={customer.customerAddress}
                    onChange={event => handleChangeCustomer(event, index)}
                    error={!(error[index].customerAddress === ' ')}
                    helperText={error[index].customerAddress}
                  />
                </div>
              </>
            ))}

            {/* Map over all the values in state to render an input for each one of them */}
            {values.map((value, index) => (
              <>
                <Divider />
                <Typography variant='h5' className={classes.formHeading}>
                  Product {values.length > 1 ? index + 1 : ''}
                </Typography>
                <div className={classes.form}>
                  {type === 'Buy' ? (
                    <Autocomplete
                      value={value.productName}
                      onInputChange={(event, newValue) => {
                        handleSearch(event, newValue, index);
                      }}
                      onChange={(event, newValue) => {
                        handleProductChange(event, newValue, index);
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        if (params.inputValue !== '') {
                          filtered.push({
                            inputValue: params.inputValue,
                            name: `Add "${params.inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                      id='productfield-input'
                      options={productsList[index]}
                      getOptionLabel={option => {
                        // e.g value selected with enter, right from the input
                        if (typeof option === 'string') {
                          return option;
                        }
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        return option.name;
                      }}
                      renderOption={option => option.name}
                      freeSolo
                      style={{ width: '100%', maxWidth: '20rem' }}
                      renderInput={params => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          placeholder='Search...'
                          required
                          label='Product Name'
                          variant='filled'
                          error={!(error[index].product === ' ')}
                          helperText={error[index].product}
                        />
                      )}
                    />
                  ) : (
                    <Autocomplete
                      value={value.productName}
                      onInputChange={(event, newValue) => {
                        handleSearch(event, newValue, index);
                      }}
                      onChange={(event, newValue) => {
                        handleProductChange(event, newValue, index);
                      }}
                      style={{ width: '100%', maxWidth: '20rem' }}
                      id='productfield-input'
                      options={productsList[index]}
                      getOptionLabel={option => {
                        // e.g value selected with enter, right from the input
                        if (typeof option === 'string') {
                          return option;
                        }
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        return option.name;
                      }}
                      getOptionSelected={(option, val) => {
                        if (val === '') {
                          return null;
                        }
                        return option.name === val;
                      }}
                      freeSolo
                      renderInput={params => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          placeholder='Search...'
                          required
                          label='Product Name'
                          variant='filled'
                          error={!(error[index].product === ' ')}
                          helperText={error[index].product}
                        />
                      )}
                    />
                  )}
                  <Typography variant='h5' className={classes.productDetails}>
                    {productDetails[index]}
                  </Typography>
                  <TextField
                    required
                    variant='filled'
                    id='price-input'
                    name='price'
                    type='number'
                    label='Price'
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    value={value.price}
                    onChange={event => handleChange(event, index)}
                    error={!(error[index].price === ' ')}
                    helperText={error[index].price}
                  />
                  <TextField
                    required
                    variant='filled'
                    id='quantity-input'
                    name='quantity'
                    type='number'
                    label='Quantity'
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    value={value.quantity}
                    onChange={event => handleChange(event, index)}
                    error={!(error[index].quantity === ' ')}
                    helperText={error[index].quantity}
                  />
                  {type === 'Buy' ? (
                    <TextField
                      variant='filled'
                      id='expiry-date-input'
                      name='expiryDate'
                      type='date'
                      label='Expiry Date'
                      InputProps={{
                        inputProps: {
                          min: new Date(Date.now()).toISOString().slice(0, 10),
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                      value={value.expiryDate}
                      onChange={event => handleChange(event, index)}
                      error={!(error[index].expiryDate === ' ')}
                      helperText={error[index].expiryDate}
                    />
                  ) : null}
                </div>
              </>
            ))}
            <Typography />
            <Button
              variant='outlined'
              color='primary'
              type='button'
              onClick={handleAddProduct}
              startIcon={<AddIcon />}
              className={classes.addProduct}
            >
              Add Products
            </Button>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              className={classes.button}
              onClick={handleSubmit}
            >
              {type}
            </Button>
          </form>
        </Paper>
      </div>
    </>
  );
};

Form.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Form;
