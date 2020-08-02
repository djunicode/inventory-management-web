import React, { createContext, useState } from 'react';
import { PropTypes } from 'prop-types';

export const ExpiryListContext = createContext();

const ExpiryListContextProvider = ({ children }) => {
  const [expiryListBadge, setExpiryListBadge] = useState(0);
  const [update, setUpdate] = useState(true);

  return (
    <ExpiryListContext.Provider
      value={{ expiryListBadge, setExpiryListBadge, update, setUpdate }}
    >
      {children}
    </ExpiryListContext.Provider>
  );
};

ExpiryListContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExpiryListContextProvider;
