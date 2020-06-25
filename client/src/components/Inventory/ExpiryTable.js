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
  TablePagination,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Spinner from '../Spinner';
import { getEndPoint } from '../UtilityFunctions/Request';

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
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);
  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const history = useHistory();

  const handleChangePage = async (event, newPage) => {
    try {
      setIsLoading(true);
      setPage(newPage);
      const response = await getEndPoint(
        `/api/explist/?limit=${rowsPerPage}&offset=${newPage * rowsPerPage}`,
        null,
        history
      );
      const { data } = response;
      setCount(data.count);
      console.log(data);
      const list = data.results.map(val => ({
        name: val.Product,
        quantity: val['No. of items'],
        daysLeft: val['Days left'],
      }));
      setExpiryList(list);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeRowsPerPage = async event => {
    try {
      setIsLoading(true);
      setPage(0);
      setRowsPerPage(+event.target.value);
      const response = await getEndPoint(
        `/api/explist/?limit=${+event.target.value}&offset=0`,
        null,
        history
      );
      const { data } = response;
      setCount(data.count);
      console.log(data);
      const list = data.results.map(val => ({
        name: val.Product,
        quantity: val['No. of items'],
        daysLeft: val['Days left'],
      }));
      setExpiryList(list);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const apiFetch = async () => {
    try {
      setIsLoading(true);
      const response = await getEndPoint(
        '/api/explist/?limit=10&offset=0',
        null,
        history
      );
      const { data } = response;
      setCount(data.count);
      console.log(data);
      const list = data.results.map(val => ({
        name: val.Product,
        quantity: val['No. of items'],
        daysLeft: val['Days left'],
      }));
      setExpiryList(list);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  // call API on component load
  useEffect(() => {
    apiFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  return (
    <>
      {isLoading ? <Spinner /> : null}
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
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component='div'
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
