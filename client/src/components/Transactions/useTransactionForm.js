import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { SnackContext } from '../SnackBar/SnackContext';

const useForm = type => {
  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    let errors = [];
    for (let i = 0; i < values.length; i += 1) {
      errors = [...errors, { product: ' ', quantity: ' ', price: ' ' }];
    }
    values.forEach((value, index) => {
      let productErr = ' ';
      let quantityErr = ' ';
      let priceErr = ' ';

      if (value.productName === '') {
        productErr = 'Please fill out this field';
      }

      if (value.quantity === '') {
        quantityErr = 'Please fill out this field';
      } else if (value.quantity === '0') {
        quantityErr = 'Quantity cannot be 0';
      }

      if (value.price === '') {
        priceErr = 'Please fill out this field';
      } else if (value.price === '0') {
        priceErr = 'Price cannot be 0';
      }

      errors[index] = {
        product: productErr,
        quantity: quantityErr,
        price: priceErr,
      };
    });
    return errors;
  };

  // values for product name, quantity and price
  const [values, setValues] = useState([
    { productName: '', quantity: '', price: '' },
  ]);
  // error messages to be added to the inputs
  const [error, setError] = useState([
    { product: ' ', quantity: ' ', price: ' ' },
  ]);
  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        price: val.latest_selling_price,
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

  const { setSnack } = useContext(SnackContext);
  // post data to API
  const apiPost = async formData => {
    const products = [];
    try {
      if (type === 'Buy') {
        const response = await axios.post('/api/buy/', formData);
        const { data } = response;
        console.log('Here is response', data);
        if (data.created) {
          products.push(data);
        }
      } else {
        const response = await axios.post('/api/sell/', formData);
        const { data } = response;
        console.log('Here is response', data);
      }
      if (products.length) {
        setSnack({
          open: true,
          message: `Added ${products[0].name}`,
          action: 'EDIT',
          actionParams: {
            name: products[0].name,
            sellingPrice: products[0].latest_selling_price,
            loose: products[0].loose,
            id: products[0].id,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const noErr = error.every(val => Object.values(val).every(v => v === ' '));
    // only runs if there are no errors and submit button is pressed
    // isSubmitting is used to avoid running on initial render
    if (noErr && isSubmitting) {
      values.forEach(val => {
        const formData = new FormData();
        formData.append('name', val.productName);
        formData.append('quantity', val.quantity);
        if (type === 'Buy') {
          formData.append('avg_cost_price', val.price);
        } else {
          formData.append('latest_selling_price', val.price);
        }
        // post data to server
        console.log(...formData);
        apiPost(formData);
      });
      setIsSubmitting(false);
      // reset inputs
      setValues([{ productName: '', quantity: '', price: '' }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  // function to handle submit
  const handleSubmit = event => {
    event.preventDefault();
    setError(validateInputs(values));
    setIsSubmitting(true);
  };

  // function to handle any change in inputs
  const handleChange = (event, index) => {
    // Use event.persist() to stop event pooling done by react
    event.persist();
    setValues(prevState => {
      const temp = [...prevState];
      temp[index] = {
        ...temp[index],
        [event.target.name]: event.target.value,
      };
      return temp;
    });
    // on sell form if product name is updated then update the price
    // according to the products list from API
    if (type === 'Sell' && event.target.name === 'productName') {
      const { price } = productsList.find(
        product => product.name === event.target.value
      );
      if (price) {
        setValues(prevState => {
          const temp = [...prevState];
          temp[index] = {
            ...temp[index],
            price,
          };
          return temp;
        });
      } else {
        setValues(prevState => {
          const temp = [...prevState];
          temp[index] = {
            ...temp[index],
            price: '',
          };
          return temp;
        });
      }
    }
  };

  // function to handle clicking of add products button
  // it adds new blank values to the state, so that new inputs can be added
  const handleAddProduct = () => {
    setValues(prevState => [
      ...prevState,
      { productName: '', quantity: '', price: '' },
    ]);
    setError(prevState => [
      ...prevState,
      { product: ' ', quantity: ' ', price: ' ' },
    ]);
  };

  return {
    values,
    error,
    handleChange,
    handleSubmit,
    productsList,
    handleAddProduct,
  };
};

export default useForm;
