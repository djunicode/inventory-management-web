import React, { createContext, useState } from 'react';
import { PropTypes } from 'prop-types';

export const SnackContext = createContext();

const SnackContextProvider = ({ children }) => {
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    action: '',
    actionParams: '',
  });

  return (
    <SnackContext.Provider value={{ snack, setSnack }}>
      {children}
    </SnackContext.Provider>
  );
};

SnackContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SnackContextProvider;
