import React, { useContext } from 'react';
import { Snackbar, Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { SnackContext } from './SnackContext';

const SimpleSnackbar = () => {
  const { snack, setSnack } = useContext(SnackContext);
  const { open, message, action, actionParams } = snack;

  const history = useHistory();

  const handleAction = () => {
    if (action === 'EDIT') {
      history.push('/updateproduct', {
        name: actionParams.name,
        sellingPrice: actionParams.sellingPrice,
        loose: actionParams.loose,
        id: actionParams.id,
      });
    }
    setSnack(prevState => ({ ...prevState, open: false }));
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack(prevState => ({ ...prevState, open: false }));
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <>
            {action === '' ? null : (
              <Button color='secondary' size='small' onClick={handleAction}>
                {action}
              </Button>
            )}

            <IconButton
              size='small'
              aria-label='close'
              color='inherit'
              onClick={handleClose}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </>
        }
      />
    </div>
  );
};

export default SimpleSnackbar;
