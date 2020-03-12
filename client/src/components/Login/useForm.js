import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useForm = validateInputs => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    errors: false,
    email: ' ',
    password: ' ',
  });
  const [isInvalidCred, setIsInvalidCred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useHistory();

  const apiFetch = async formData => {
    try {
      const response = await axios.post('/auth/token/login', formData);
      const { data } = response;
      localStorage.setItem('token', data.auth_token);
      history.push('/');
    } catch (e) {
      setIsInvalidCred(true);
    }
  };

  useEffect(() => {
    if (!error.errors && isSubmitting) {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      apiFetch(formData);
      setIsSubmitting(false);
      setValues(prevState => ({ ...prevState, email: '', password: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSubmitting]);

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = event => {
    if (event) event.preventDefault();
    setError(validateInputs(values));
    setIsSubmitting(true);
  };

  const handleChange = event => {
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
    setIsInvalidCred,
    values,
    showPassword,
    setError,
    toggleShowPassword,
  };
};

export default useForm;
