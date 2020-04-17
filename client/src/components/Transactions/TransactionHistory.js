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

const TransactionHistory = () => {
  // list of all transactions got from API
  const [transactionList, setTransactionList] = useState([]);

  // fetch transaction list from API
  const apiFetch = async () => {
    try {
      const response = await axios.get('/api/bill');
      const { data } = response;
      setTransactionList(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    apiFetch();
  }, []);

  const classes = useStyles();

  // parse date to proper format
  const parseDate = date => {
    const newDate = new Date(date).toDateString().slice(4);
    return newDate;
  };

  // parse price to proper format
  const parsePrice = transactions => {
    return transactions.reduce((acc, obj) => acc + obj.rate * obj.quantity, 0);
  };

  return (
    <Paper className={classes.paper}>
      <TableContainer>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell> ID </TableCell>
              <TableCell> Date </TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align='right'>Price (Rs)</TableCell>
              <TableCell align='center'>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionList.map(row => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{parseDate(row.date_time)}</TableCell>
                <TableCell>
                  {row.transaction.map((val, index) =>
                    index === row.transaction.length - 1
                      ? val.name
                      : `${val.name}, `
                  )}
                </TableCell>
                <TableCell>
                  {row.transaction.map((val, index) =>
                    index === row.transaction.length - 1
                      ? val.quantity
                      : `${val.quantity}, `
                  )}
                </TableCell>
                <TableCell align='right'>
                  {parsePrice(row.transaction)}
                </TableCell>
                <TableCell align='center'>
                  {row.in_or_out === 'In' ? 'Buy' : 'Sell'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionHistory;
