import React from 'react';
import { Tooltip, withStyles } from '@material-ui/core';
import { PropTypes } from 'prop-types';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    width: 100,
    borderRadius: '0.5rem',
    boxShadow: '4px 4px 20px rgba(0,0,0,0.2)',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: '1px solid #dadde9',
    padding: '0.5rem',
    textAlign: 'center',
    '& h4': {
      fontSize: theme.typography.pxToRem(12),
      fontWeight: 'normal',
      marginBottom: '2px',
    },
    '& *': {
      margin: '5px',
    },
  },
}))(Tooltip);

const GraphTooltip = ({ children, title }) => {
  return (
    <CustomTooltip title={title} placement='top'>
      {children}
    </CustomTooltip>
  );
};

GraphTooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired,
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired,
  ]).isRequired,
};

export default GraphTooltip;
