import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SnackContext } from '../SnackBar/SnackContext';
import { postEndPoint } from '../UtilityFunctions/Request';

// custom hook for form state management
const useForm = ({ firstName, lastName, age, isStaff, email }) => {
  // function to validate inputs, returns the error statements
  const validateInputs = values => {
    const err = {
      errors: false,
      firstName: ' ',
      lastName: ' ',
      age: ' ',
    };

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
    firstName,
    lastName,
    age,
    isStaff: isStaff ? 'True' : 'False',
  });

  // error messages to be added to the inputs
  const [error, setError] = useState({
    errors: false,
    firstName: ' ',
    lastName: ' ',
    age: ' ',
  });

  // contains the error value. value depends on the response from server
  const [invalidCred, setInvalidCred] = useState('');
  // true only if submit button is pressed
  const [isSubmitting, setIsSubmitting] = useState(false);
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  // function to post the credentials to the server, then user is redirected to employee page.
  //  if credentials are invalid then invalidcred is set to appropriate errors got from API
  const apiFetch = async formData => {
    try {
      setIsLoading(true);
      await postEndPoint('/auth/user_update/', formData, null, history);
      setIsLoading(false);

      // add success snackbar on successful request
      setSnack({
        open: true,
        message: `Succesfully updated ${values.firstName} ${values.lastName}`,
        action: '',
        actionParams: '',
        type: 'success',
      });
      history.push('/employee');
    } catch (e) {
      console.log(e.response);
      if (e.response.status === 400) {
        const responseError = Object.values(e.response.data)[0][0];
        setInvalidCred(responseError);
        setIsLoading(false);

        // add error snackbar on unsuccessful request
        setSnack({
          open: true,
          message: responseError,
          action: '',
          actionParams: '',
          type: 'error',
        });
      }
    }
  };

  useEffect(() => {
    // only runs if there are no errors and submit button is pressed
    // isSubmitting is used to avoid running on initial render
    if (!error.errors && isSubmitting) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('age', values.age);
      formData.append('is_staff', values.isStaff);
      console.log(...formData);
      // post data to server
      apiFetch(formData);
      setIsSubmitting(false);
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
    invalidCred,
    setInvalidCred,
    values,
    setError,
    isLoading,
  };
};

export default useForm;
