import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Hidden,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { SnackContext } from '../SnackBar/SnackContext';
import MobileEditMenu from '../MobileEditMenu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    borderRadius: '10px',
  },
  table: {
    backgroundColor: 'white',
    borderRadius: '10px',
    '& th': {
      backgroundColor: '#e7eff3',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: theme.text.color.dark,
      [theme.breakpoints.only('xs')]: {
        fontSize: theme.typography.pxToRem(14),
      },
    },
    '& td': {
      fontSize: '1.5rem',
      color: theme.text.color.darkGray,
      [theme.breakpoints.only('xs')]: {
        fontSize: '1rem',
      },
    },
    '& .MuiTableCell-root': {
      [theme.breakpoints.only('xs')]: {
        padding: theme.spacing(1),
      },
    },
    '& tr.delete': {
      display: 'none',
    },
  },
  heading: {
    fontWeight: '700',
    marginBottom: theme.spacing(5),
  },
  firstColumn: {
    width: '7rem',
    paddingRight: 0,
    [theme.breakpoints.only('xs')]: {
      width: 'initial',
      paddingLeft: theme.spacing(1),
    },
  },
}));

export default function Inventory() {
  // list of inventory got from API
  const [inventoryList, setInventoryList] = useState([]);
  // contains the index of the row, if delete is used
  const [deletedRow, setDeletedRow] = useState([]);
  // dialog box
  const [open, setOpen] = useState(false);
  // row to be selected on clicking the delete icon
  const [selectedRow, setSelectedRow] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  const apiFetch = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Token ${token}` } };
      const response = await axios.get('/api/productlist/', config);
      const { data } = response;
      const list = data.map((val) => ({
        name: val.name,
        quantity: val.quantity,
        sellingPrice: val.latest_selling_price,
        loose: val.loose,
        id: val.id,
      }));
      setInventoryList(list);
    } catch (e) {
      console.log(e);
    }
  };

  // call API on component load
  useEffect(() => {
    apiFetch();
  }, []);

  const classes = useStyles();

  // handle product delete
  const handleDelete = async (row) => {
    const { id } = row;
    setDeletedRow((prevState) => [...prevState, inventoryList.indexOf(row)]);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Token ${token}` } };
      await axios.delete(`/api/productlist/${id}/`, config);

      // add success snackbar on successful request
      const { name } = inventoryList.find((val) => val.id === id);
      setSnack({
        open: true,
        message: `Succesfully deleted ${name}`,
        action: '',
        actionParams: '',
        type: 'success',
      });
    } catch (e) {
      console.log(e);
    }
  };

  // handle product edit
  const handleEdit = (row) => {
    history.push('/updateproduct', {
      name: row.name,
      sellingPrice: row.sellingPrice,
      loose: row.loose,
      id: row.id,
    });
  };

  return (
    <>
      <Typography variant='h3' className={classes.heading}>
        Inventory
      </Typography>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Product</TableCell>
                <TableCell align='right'>Items</TableCell>
                <TableCell align='right'>Price (Rs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryList.map((row, index) => (
                <TableRow
                  key={row.name}
                  hover
                  className={deletedRow.includes(index) ? 'delete' : ''}
                >
                  <TableCell className={classes.firstColumn}>
                    <Hidden xsDown>
                      <IconButton
                        onClick={() => {
                          handleEdit(row);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedRow(row);
                          handleClickOpen();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Hidden>
                    <Hidden smUp>
                      <MobileEditMenu
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        row={row}
                      />
                    </Hidden>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align='right'>{row.quantity}</TableCell>
                  <TableCell align='right'>
                    {row.sellingPrice || 'Not Set'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* start of dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Delete ' + selectedRow.name + '?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete {selectedRow.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} color='primary'>
            Disagree
          </IconButton>
          <IconButton
            onClick={() => {
              handleDelete(selectedRow);
              handleClose();
            }}
            color='primary'
            autoFocus
          >
            Agree
          </IconButton>
        </DialogActions>
      </Dialog>
      {/* end of dialog */}
    </>
  );
}
