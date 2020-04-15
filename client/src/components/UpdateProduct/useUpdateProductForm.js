import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// custom hook for form state management
const useForm = ({ name, sellingPrice, loose, id }) => {
  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    const err = {
      errors: false,
      name: ' ',
      sellingPrice: ' ',
      loose: ' ',
    };

    if (values.sellingPrice === '0') {
      err.sellingPrice = 'Selling Price cannot be 0';
      err.errors = true;
    }

    Object.keys(values).forEach(key => {
      if (values[key] === '') {
        err[key] = 'Please fill out this field';
        err.errors = true;
      }
    });

    return err;
  };

  // values for name , selling price and loose
  // got from location state
  const [values, setValues] = useState({
    name,
    sellingPrice: sellingPrice || '',
    loose: loose === true ? 'true' : 'false',
  });

  // error messages to be added to the inputs
  const [error, setError] = useState({
    errors: false,
    name: ' ',
    sellingPrice: ' ',
    loose: ' ',
  });

  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useHistory();

  // function to post the credentials to the server, then user is redirected to employee page.
  //  if credentials are invalid then invalidcred is set to appropriate errors got from API
  const apiFetch = async formData => {
    try {
      await axios.post(`/api/update/${id}/`, formData);
      history.push('/inventory');
    } catch (e) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    // only runs if there are no errors and submit button is pressed
    // isSubmitting is used to avoid running on initial render
    if (!error.errors && isSubmitting) {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('latest_selling_price', values.sellingPrice);
      const looseVal = values.loose === 'true' ? 'True' : 'False';
      formData.append('loose', looseVal);
      // post data to server
      apiFetch(formData);
      setIsSubmitting(false);
      // reset inputs
      setValues(prevState => ({
        ...prevState,
        name: ' ',
        sellingPrice: ' ',
        loose: 'true',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  // function to handle submit
  const handleSubmit = event => {
    if (event) event.preventDefault();
    setError(validateInputs(values));
    setIsSubmitting(true);
  };

  // function to handle any change in inputs
  const handleChange = event => {
    // Use event.persist() to stop event pooling done by react
    event.persist();
    setValues(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleChange,
    handleSubmit,
    error,
    values,
  };
};

export default useForm;
