import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// custom hook for form state management
const useForm = () => {
  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    let errors1 = false;
    let password1 = ' ';
    let email1 = ' ';

    if (values.email === '') {
      errors1 = true;
      email1 = 'Please fill out this field';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors1 = true;
      email1 = 'Please enter a valid email';
    }
    if (values.password === '') {
      errors1 = true;
      password1 = 'Please fill out this field';
    } else if (values.password.length < 5) {
      errors1 = true;
      password1 = 'Password should have more than 5 characters';
    }

    return {
      errors: errors1,
      email: email1,
      password: password1,
    };
  };

  // values of email and password
  const [values, setValues] = useState({ email: '', password: '' });

  // toggle to show password on password input
  const [showPassword, setShowPassword] = useState(false);

  // error messages to be added to the inputs
  const [error, setError] = useState({
    errors: false,
    email: ' ',
    password: ' ',
  });
  // true if Credentials entered arent valid. value depends on the response from server
  const [isInvalidCred, setIsInvalidCred] = useState(false);

  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);

  // used to programmatically change the url
  const history = useHistory();

  // function to post the credentials to the server. if credentials are valid then we get a token,
  // which is stored in localStorage and then user is redirected to homepage.
  // otherwise isInvalidCred is set to true

  const apiFetch = async formData => {
    try {
      const response = await axios.post('/auth/token/login', formData);
      const { data } = response;
      localStorage.setItem('token', data.auth_token);
      // call API to check if current user is admin
      const config = { headers: { Authorization: `Token ${data.auth_token}` } };
      const res = await axios.get('/auth/users/me', config);
      // add the is_staff variable got fro API to localStorage
      localStorage.setItem('isStaff', res.data.is_staff);
      history.push('/');
    } catch (e) {
      setIsInvalidCred(true);
    }
  };

  useEffect(() => {
    // only runs if there are no errors and submit button is pressed
    // isSubmitting is used to avoid running on initial render
    if (!error.errors && isSubmitting) {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      // post data to server
      apiFetch(formData);
      setIsSubmitting(false);
      // reset inputs
      setValues(prevState => ({ ...prevState, email: '', password: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  // function to toggle show password
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
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
    isInvalidCred,
    values,
    showPassword,
    toggleShowPassword,
  };
};

export default useForm;
