import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SnackContext } from '../SnackBar/SnackContext';
import { getEndPoint, postEndPoint } from '../UtilityFunctions/Request';
import { ExpiryListContext } from '../ExpiryListContext';

const useForm = type => {
  // list of all products got from API
  const [productsList, setProductsList] = useState([[]]);
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);

  const { setUpdate } = useContext(ExpiryListContext);

  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    let errors = [];
    for (let i = 0; i < values.length; i += 1) {
      errors = [
        ...errors,
        { product: ' ', quantity: ' ', price: ' ', expiryDate: ' ' },
      ];
    }
    values.forEach((value, index) => {
      let productErr = ' ';
      let quantityErr = ' ';
      let priceErr = ' ';
      const expiryErr = ' ';

      if (type === 'Sell' && value.productName) {
        const { quantity } = productsList.find(
          product => product.name === value.productName
        );
        if (Number(value.quantity) > Number(quantity)) {
          quantityErr = `Quantity cannot be greater than current stock : - ${quantity}`;
        }
      }

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
        expiryDate: expiryErr,
      };
    });
    return errors;
  };

  // values for product name, quantity and price
  const [values, setValues] = useState([
    {
      productName: '',
      quantity: '',
      price: '',
      expiryDate: '',
    },
  ]);
  // error messages to be added to the inputs
  const [error, setError] = useState([
    { product: ' ', quantity: ' ', price: ' ', expiryDate: ' ' },
  ]);
  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productDetails, setProductDetails] = useState([
    'Select a product to view details',
  ]);

  const history = useHistory();

  const { setSnack } = useContext(SnackContext);
  // post data to API
  const apiPost = async formData => {
    setIsLoading(true);
    const products = [];
    try {
      if (type === 'Buy') {
        const response = await postEndPoint(
          '/api/buy/',
          formData,
          null,
          history
        );
        const { data } = response;
        console.log('Here is response', data);
        if (data.created) {
          products.push(data);
        }
      } else {
        const response = await postEndPoint(
          '/api/sell/',
          formData,
          null,
          history
        );
        const { data } = response;
        console.log('Here is response', data);
      }
      setIsLoading(false);
      if (products.length) {
        // add success snackbar if new product created
        const product = products[0];
        setSnack({
          open: true,
          message: `Added ${product.name}`,
          action: 'EDIT',
          actionParams: {
            name: product.name,
            sellingPrice: product.latest_selling_price,
            loose: product.loose,
            id: product.id,
            upperLimit: product.upper_limit === null ? '' : product.upper_limit,
            lowerLimit: product.lower_limit === null ? '' : product.upper_limit,
          },
        });
      } else if (type === 'Buy') {
        // add success snackbar on successful transaction
        setSnack({
          open: true,
          message: `Succesfully bought items`,
          action: '',
          actionParams: '',
          type: 'success',
        });
      } else if (type === 'Sell') {
        // add success snackbar on successful transaction
        setSnack({
          open: true,
          message: `Succesfully sold items`,
          action: '',
          actionParams: '',
          type: 'success',
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
        formData.append('expiry', val.expiryDate);
        if (type === 'Buy') {
          formData.append('avg_cost_price', val.price);
        } else {
          formData.append('latest_selling_price', val.price);
        }
        // post data to server
        console.log(...formData);
        apiPost(formData);
        setUpdate(prevState => !prevState);
      });
      setIsSubmitting(false);
      // reset inputs
      setValues([{ productName: '', quantity: '', price: '', expiryDate: '' }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  useEffect(() => {
    const newProductDetails = [];
    values.forEach((value, index) => {
      let newDetails = 'Select a product to view details';
      if (value.productName !== '') {
        const currProduct = productsList.find(
          product => product.name === value.productName
        );
        if (currProduct) {
          if (type === 'Buy') {
            newDetails = `${currProduct.quantity} in inventory ${
              currProduct.upperLimit === null
                ? ''
                : `, ${currProduct.upperLimit} Recommended limit`
            } `;
          } else {
            newDetails = `${currProduct.quantity} in inventory${
              currProduct.lowerLimit === null
                ? ''
                : `, ${currProduct.lowerLimit} Critical limit`
            } `;
          }
        } else {
          newDetails = 'No Details';
        }
      }
      newProductDetails[index] = newDetails;
    });
    setProductDetails(newProductDetails);
  }, [productsList, type, values]);

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
  };

  const handleProductChange = (event, newValue, index) => {
    if (type === 'Buy') {
      if (newValue && newValue.inputValue) {
        setValues(prevState => {
          const temp = [...prevState];
          temp[index] = {
            ...temp[index],
            productName: newValue.inputValue,
          };
          return temp;
        });
        return;
      }

      setValues(prevState => {
        const temp = [...prevState];
        let val = '';

        if (!newValue) {
          val = '';
        } else if (newValue.name) {
          val = newValue.name;
        } else {
          val = newValue;
        }
        temp[index] = {
          ...temp[index],
          productName: val,
        };
        return temp;
      });
    } else {
      let val = '';
      if (newValue === null) {
        val = '';
      } else if (typeof newValue === 'string') {
        val = newValue;
      } else if (typeof newValue === 'object') {
        val = newValue.name;
      }
      setValues(prevState => {
        const temp = [...prevState];
        temp[index] = {
          ...temp[index],
          productName: val,
        };
        return temp;
      });

      // on sell form if product name is updated then update the price
      // according to the products list from API
      const matchedProduct =
        productsList.find(product => product.name === val) || {};

      setValues(prevState => {
        const temp = [...prevState];
        temp[index] = {
          ...temp[index],
          price: matchedProduct.price || '',
        };
        return temp;
      });
    }
  };

  // function to handle clicking of add products button
  // it adds new blank values to the state, so that new inputs can be added
  const handleAddProduct = () => {
    setValues(prevState => [
      ...prevState,
      { productName: '', quantity: '', price: '', expiryDate: '' },
    ]);
    setError(prevState => [
      ...prevState,
      { product: ' ', quantity: ' ', price: ' ', expiryDate: ' ' },
    ]);
    setProductDetails(prevState => [
      ...prevState,
      'Select a product to view details',
    ]);
    setProductsList(prevState => [...prevState, []]);
  };

  const handleSearch = async (event, newValue, index) => {
    try {
      const response = await getEndPoint(
        `/api/productlist/?limit=10&offset=0&search=${newValue}`,
        null,
        history
      );
      const { data } = response;
      const list = data.results.map(val => ({
        name: val.name,
        quantity: val.quantity,
        price: val.latest_selling_price,
        id: val.id,
        upperLimit: val.upper_limit,
        lowerLimit: val.lower_limit,
      }));
      setProductsList(prevState => {
        const temp = [...prevState];
        let val = list;
        if (newValue === '') {
          val = [];
        }
        temp[index] = val;
        return temp;
      });
    } catch (e) {
      console.log(e);
    }
  };

  return {
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
  };
};

export default useForm;
