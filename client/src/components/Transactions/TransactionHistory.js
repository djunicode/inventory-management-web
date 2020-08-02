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
  IconButton,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Spinner from '../Spinner';
import { getEndPoint } from '../UtilityFunctions/Request';
import { ReactComponent as Vector } from '../../images/Vector.svg';

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
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  // fetch transaction list from API
  const apiFetch = async () => {
    try {
      setIsLoading(true);
      const response = await getEndPoint('/api/bill/', null, history);
      const { data } = response;
      setTransactionList(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    apiFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  // parse date to proper format
  const parseDate = date => {
    const newDate = new Date(date).toDateString().slice(4);
    return newDate;
  };

  // parse products to proper format
  const parseProducts = entries => {
    return entries.reduce((acc, obj) => `${acc} ${obj.name}, `, '');
  };

  const handleClick = async id => {
    const response = await getEndPoint(`/api/pdf/${id}`, null, history);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice${id}.pdf`);
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell> ID </TableCell>
                <TableCell align='center' />
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
                  <TableCell>
                    <IconButton onClick={() => handleClick(row.id)}>
                      <Vector />
                    </IconButton>
                  </TableCell>
                  <TableCell>{parseDate(row.date_time)}</TableCell>
                  <TableCell>
                    {parseProducts(JSON.parse(row.billdetails).entries)}
                  </TableCell>
                  <TableCell>
                    {JSON.parse(row.billdetails).total_items}
                  </TableCell>
                  <TableCell align='right'>
                    {JSON.parse(row.billdetails).total_bill}
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
    </>
  );
};

export default TransactionHistory;
