import React from 'react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PropTypes } from 'prop-types';

export default function DialogBox({
  open,
  number,
  handleClose,
  selectedRow,
  handleDelete,
  handleClick,
}) {
  let title = '';
  let content = '';
  if (number === '1') {
    title = `Delete ${selectedRow.name}?`;
    content = `Are you sure you want to delete ${selectedRow.name}?`;
  } else if (number === '2') {
    title = 'Are you sure you wish to logout?';
    content = 'If you Agree, you will be logged out from all devices...';
  }

  const handleDialog = () => {
    if (number === '1') {
      handleDelete(selectedRow);
      handleClose();
    } else if (number === '2') {
      handleClick();
    }
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Disagree
          </Button>
          <Button onClick={handleDialog} color='secondary' autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DialogBox.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selectedRow: PropTypes.object.isRequired,
  number: PropTypes.string.isRequired,
};
