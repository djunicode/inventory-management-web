import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// custom hook for form state management
const useForm = () => {
  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    const err = {
      errors: false,
      firstName: ' ',
      lastName: ' ',
      email: ' ',
      password: ' ',
      confirmPassword: ' ',
      age: ' ',
      gender: ' ',
    };

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      err.email = 'Please enter a valid email';
      err.errors = true;
    }
    if (values.password.length < 5) {
      err.password = 'Password should have more than 5 characters';
      err.errors = true;
    }
    if (values.confirmPassword !== values.password) {
      err.confirmPassword = 'Passwords do not match';
      err.errors = true;
    }

    if (values.age === '0') {
      err.age = 'Age cannot be 0';
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

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'M',
    isStaff: 'true',
  });
  // toggle to show password on password input
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  // error messages to be added to the inputs
  const [error, setError] = useState({
    errors: false,
    firstName: ' ',
    lastName: ' ',
    email: ' ',
    password: ' ',
    confirmPassword: ' ',
    age: ' ',
    gender: ' ',
  });

  // contains the error value. value depends on the response from server
  const [invalidCred, setInvalidCred] = useState('');
  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useHistory();

  // function to post the credentials to the server, then user is redirected to employee page.
  //  if credentials are invalid then invalidcred is set to appropriate errors got from API
  const apiFetch = async formData => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Token ${token}` } };
      await axios.post('/auth/users/', formData, config);
      history.push('/employee');
    } catch (e) {
      console.log(e.response);
      if (e.response.status === 400) {
        setInvalidCred(Object.values(e.response.data)[0][0]);
      }
    }
  };

  useEffect(() => {
    // only runs if there are no errors and submit button is pressed
    // isSubmitting is used to avoid running on initial render
    if (!error.errors && isSubmitting) {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('age', values.age);
      formData.append('gender', values.gender);
      formData.append('is_staff', values.isStaff);
      // post data to server
      apiFetch(formData);
      setIsSubmitting(false);
      // reset inputs
      setValues(prevState => ({
        ...prevState,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: 'M',
        isStaff: 'true',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  // function to toggle show password
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleShowconfirmPassword = () => {
    setConfirmPassword(prevState => !prevState);
  };

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
    invalidCred,
    setInvalidCred,
    values,
    showPassword,
    showConfirmPassword,
    setError,
    toggleShowPassword,
    toggleShowconfirmPassword,
  };
};

export default useForm;
