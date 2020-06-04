import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  paper: {
    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    borderRadius: '10px',
  },
  tableContainer: {
    border: '2px solid #f2c94c',
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
  },
}));

export default function ExpiryTable() {
  // list of near expiry products got from API
  const [expiryList, setExpiryList] = useState([]);

  const apiFetch = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Token ${token}` } };
      const response = await axios.get('/api/explist/', config);
      const { data } = response;
      console.log(data);
      const list = data.map(val => ({
        name: val.Product,
        quantity: val['No. of items'],
        daysLeft: val['Days left'],
      }));
      setExpiryList(list);
    } catch (e) {
      console.log(e);
    }
  };

  // call API on component load
  useEffect(() => {
    apiFetch();
  }, []);

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align='right'>Items</TableCell>
              <TableCell align='right'>Days Left</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expiryList.map(row => (
              <TableRow key={row.name} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell align='right'>{row.quantity}</TableCell>
                <TableCell align='right'>{row.daysLeft}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
