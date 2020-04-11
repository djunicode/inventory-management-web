import React, { useState, useEffect } from 'react';
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
  Fab,
  IconButton,
  Hidden,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import MobileEditMenu from '../MobileEditMenu';

const useStyles = makeStyles(theme => ({
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
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
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
  const [deletedRow, setDeletedRow] = useState('');

  const apiFetch = async () => {
    try {
      const response = await axios.get('/api/productlist');
      const { data } = response;
      const list = data.map(val => ({
        name: val.name,
        quantity: val.quantity,
        price: val.selling_price,
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

  // handle click on the FAB
  const handleFabClick = () => {
    // TODO implement this when endpoint is ready
    // open the create product form
    // add a route for addproduct
  };

  // handle product delete
  const handleDelete = async row => {
    const { id } = row;
    setDeletedRow(inventoryList.indexOf(row));
    try {
      await axios.delete(`/api/productlist/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  // handle product edit
  const handleEdit = row => {
    console.log(row);
    // TODO implement this when endpoint is ready
    // open the create product form and pass the data as props
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
                  className={index === deletedRow ? 'delete' : ''}
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
                          handleDelete(row);
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
                  <TableCell align='right'>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Fab
        color='primary'
        aria-label='add'
        className={classes.fab}
        onClick={handleFabClick}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
