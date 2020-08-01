import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
  menuItem: {
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
}));

// menu for edit and delete actions on mobile
const MobileEditMenu = ({ handleDelete, handleEdit, row }) => {
  // set anchor for menu
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();

  // handle menu open
  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  // handle menu close by selecting edit or delete action
  const handleMenuClose = (option, param) => {
    if (option) {
      if (option === 'Edit') {
        handleEdit(param);
      } else if (option === 'Delete') {
        handleDelete(param);
      }
    }
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuClick}>
        <MenuIcon className={classes.menuIcon} />
      </IconButton>
      <Menu
        elevation={3}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose('Edit', row);
          }}
          className={classes.menuItem}
        >
          <EditIcon /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose('Delete', row);
          }}
          className={classes.menuItem}
        >
          <DeleteIcon /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

MobileEditMenu.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  row: PropTypes.object.isRequired,
};

export default MobileEditMenu;
