import React from 'react';
import { IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DialogBox(props) {
  var title = '';
  var content = '';
  if (props.number === '1') {
    title = `Delete ${props.selectedRow.name}?`;
    content = `Are you sure you want to delete ${props.selectedRow.name}?`;
  } else if (props.number === '2') {
    title = 'Are you sure you wish to logout?';
    content = 'If you Agree, you will be logged out from all devices...';
  }

  const handleDialog = () => {
    if (props.number === '1') {
      props.handleDelete(props.selectedRow);
      props.handleClose();
    } else if (props.number === '2') {
      props.handleClick();
    }
  };
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
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
          <IconButton onClick={props.handleClose} color='primary'>
            Disagree
          </IconButton>
          <IconButton
            onClick={() => {
              handleDialog();
            }}
          >
            Agree
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
