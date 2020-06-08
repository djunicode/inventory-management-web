import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';

axios.defaults.baseURL = 'https://chouhanaryan.pythonanywhere.com/';

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    const tokenConfig = config;
    const token = localStorage.getItem('token');
    if (token) {
      tokenConfig.headers.Authorization = `Token ${token}`;
    }
    return tokenConfig;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
