import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// custom hook for form state management
const useForm = ({ name, mrp, loose, id }) => {
  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    const err = {
      errors: false,
      name: ' ',
      mrp: ' ',
      loose: 'true',
    };

    if (values.mrp === '0') {
      err.mrp = 'MRP cannot be 0';
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

  // values for name , mrp and loose
  // got from location state
  const [values, setValues] = useState({
    name,
    mrp,
    loose: loose === true ? 'true' : 'false',
  });

  // error messages to be added to the inputs
  const [error, setError] = useState({
    errors: false,
    name: ' ',
    mrp: ' ',
    loose: 'true',
  });

  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useHistory();

  // function to post the credentials to the server, then user is redirected to employee page.
  //  if credentials are invalid then invalidcred is set to appropriate errors got from API
  const apiFetch = async formData => {
    try {
      const config = {
        headers: {
          'X-CSRFToken': `KKuuRqgKGizqqBjN5TtIbMQm2nMPvrcutbVyWxPOehpgf1ZJMxX8eVkubO7bLkGO`,
        },
      };
      await axios.put(`/api/productlist/${id}/`, formData, config);
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
      formData.append('mrp', values.mrp);
      formData.append('loose', values.loose);
      // post data to server
      apiFetch(formData);
      setIsSubmitting(false);
      // reset inputs
      setValues(prevState => ({
        ...prevState,
        name: ' ',
        mrp: ' ',
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
