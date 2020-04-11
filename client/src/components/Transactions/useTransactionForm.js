import { useState, useEffect } from 'react';
import axios from 'axios';

const useTransactionForm = type => {
  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    let errors = [];
    for (let i = 0; i < values.length; i += 1) {
      errors = [...errors, { product: ' ', quantity: ' ' }];
    }
    values.forEach((value, index) => {
      let productErr = ' ';
      let quantityErr = ' ';

      if (value.productName === '') {
        productErr = 'Please fill out this field';
      }

      if (value.quantity === '') {
        quantityErr = 'Please fill out this field';
      } else if (value.quantity === '0') {
        quantityErr = 'Quantity cannot be 0';
      }

      errors[index] = { product: productErr, quantity: quantityErr };
    });
    return errors;
  };

  // function to validate price input, returns the error statements
  const validatePrice = price => {
    let errors = [];
    for (let i = 0; i < price.length; i += 1) {
      errors = [...errors, ' '];
    }
    price.forEach((val, index) => {
      let priceErr = ' ';
      if (val === '') {
        priceErr = 'Please fill out this field';
      } else if (val === '0') {
        priceErr = 'Price cannot be 0';
      }
      errors[index] = priceErr;
    });
    return errors;
  };
  // TODO add an isError variable to check if there is an error in page or not while submitting
  // values for product name and quantity
  const [values, setValues] = useState([{ productName: '', quantity: '' }]);
  // error messages to be added to the inputs
  const [error, setError] = useState([{ product: ' ', quantity: ' ' }]);
  // value for price
  const [price, setPrice] = useState(['']);
  // error messages to be added to the price inputs
  const [priceErr, setPriceErr] = useState([' ']);

  // list of all products got from API
  const [productsList, setProductsList] = useState([]);

  // fetch the products list from API
  const apiFetch = async () => {
    try {
      const response = await axios.get('/api/productlist');
      const { data } = response;
      const list = data.map(val => ({
        name: val.name,
        quantity: val.quantity,
        price: val.selling_price,
        id: val.id,
      }));
      setProductsList(list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    apiFetch();
  }, []);

  // function to handle submit
  const handleSubmit = event => {
    event.preventDefault();
    const err = validateInputs(values);
    if (type === 'Buy') {
      const priceError = validatePrice(price);
      setPriceErr(priceError);
    }
    setError(err);
  };

  // function to handle any change in inputs
  const handleChange = (event, index) => {
    // Use event.persist() to stop event pooling done by react
    event.persist();
    if (type === 'Buy' && event.target.name === 'price') {
      setPrice(prevState => {
        const temp = [...prevState];
        temp[index] = event.target.value;
        return temp;
      });
    } else {
      setValues(prevState => {
        const temp = [...prevState];
        temp[index] = {
          ...temp[index],
          [event.target.name]: event.target.value,
        };
        return temp;
      });
    }
  };

  // function to handle clicking of add products button
  // it adds new blank values to the state, so that new inputs can be added
  const handleAddProduct = () => {
    setValues(prevState => [...prevState, { productName: '', quantity: '' }]);
    setError(prevState => [...prevState, { product: ' ', quantity: ' ' }]);
    if (type === 'Buy') {
      setPrice(prevState => [...prevState, '']);
      setPriceErr(prevState => [...prevState, ' ']);
    }
  };

  return {
    values,
    error,
    handleChange,
    handleSubmit,
    productsList,
    handleAddProduct,
    price,
    priceErr,
  };
};

export default useTransactionForm;
