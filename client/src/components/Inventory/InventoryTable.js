import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Paper,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Hidden,
  TablePagination,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import MobileEditMenu from '../MobileEditMenu';
import { SnackContext } from '../SnackBar/SnackContext';
import Spinner from '../Spinner';
import DialogBox from '../DialogBox/DialogBox';
import { getEndPoint } from '../UtilityFunctions/Request';

const useStyles = makeStyles(theme => ({
  search: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    marginTop: '0',
  },
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
  firstColumn: {
    width: '7rem',
    paddingRight: 0,
    [theme.breakpoints.only('xs')]: {
      width: 'initial',
      paddingLeft: theme.spacing(1),
    },
  },
}));

export default function InventoryTable() {
  // list of inventory got from API
  const [inventoryList, setInventoryList] = useState([]);
  // contains the index of the row, if delete is used
  const [deletedRow, setDeletedRow] = useState([]);
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);
  // dialog box
  const [open, setOpen] = useState(false);
  // row to be selected on clicking the delete icon
  const [selectedRow, setSelectedRow] = useState({});
  // list of search results got from API
  const [searchList, setSearchList] = useState([]);
  // search results input field
  const [search, setSearch] = useState('');
  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  // search pagination
  const [searchPage, setSearchPage] = useState(0);
  const [searchRowsPerPage, setSearchRowsPerPage] = useState(10);
  const [searchCount, setSearchCount] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };
  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  const handleSearchChangePage = async (event, newPage) => {
    try {
      setIsLoading(true);
      setSearchPage(newPage);
      const response = await getEndPoint(
        `/api/productlist/?limit=${searchRowsPerPage}&offset=${newPage *
          searchRowsPerPage}&search=${search}`,
        null,
        history
      );
      // Use utility function

      // console.log("error",response) check error code here for reference

      const { data } = response;
      setSearchCount(data.count);
      const list = data.results.map(val => ({
        name: val.name,
        quantity: val.quantity,
        sellingPrice: val.latest_selling_price,
        loose: val.loose,
        id: val.id,
        upperLimit: val.upper_limit === null ? '' : val.upper_limit,
        lowerLimit: val.lower_limit === null ? '' : val.lower_limit,
      }));
      setInventoryList(list);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearchChangeRowsPerPage = async event => {
    try {
      setIsLoading(true);
      setSearchPage(0);
      setSearchRowsPerPage(+event.target.value);
      const response = await getEndPoint(
        `/api/productlist/?limit=${+event.target
          .value}&offset=0&search=${search}`,
        null,
        history
      );
      // Use utility function

      // console.log("error",response) check error code here for reference

      const { data } = response;
      setSearchCount(data.count);
      const list = data.results.map(val => ({
        name: val.name,
        quantity: val.quantity,
        sellingPrice: val.latest_selling_price,
        loose: val.loose,
        id: val.id,
        upperLimit: val.upper_limit === null ? '' : val.upper_limit,
        lowerLimit: val.lower_limit === null ? '' : val.lower_limit,
      }));
      setInventoryList(list);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangePage = async (event, newPage) => {
    try {
      setIsLoading(true);
      setPage(newPage);
      const response = await getEndPoint(
        `/api/productlist/?limit=${rowsPerPage}&offset=${newPage *
          rowsPerPage}`,
        null,
        history
      );
      // Use utility function

      // console.log("error",response) check error code here for reference

      const { data } = response;
      setCount(data.count);
      const list = data.results.map(val => ({
        name: val.name,
        quantity: val.quantity,
        sellingPrice: val.latest_selling_price,
        loose: val.loose,
        id: val.id,
        upperLimit: val.upper_limit === null ? '' : val.upper_limit,
        lowerLimit: val.lower_limit === null ? '' : val.lower_limit,
      }));
      setSearchList(list);
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
        `/api/productlist/?limit=${+event.target.value}&offset=0`,
        null,
        history
      );
      // Use utility function

      // console.log("error",response) check error code here for reference

      const { data } = response;
      setCount(data.count);
      const list = data.results.map(val => ({
        name: val.name,
        quantity: val.quantity,
        sellingPrice: val.latest_selling_price,
        loose: val.loose,
        id: val.id,
        upperLimit: val.upper_limit === null ? '' : val.upper_limit,
        lowerLimit: val.lower_limit === null ? '' : val.lower_limit,
      }));
      setSearchList(list);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSearch = async data => {
    setSearch(data); // set data

    // console.log("data",data) //reference
    setSearchPage(0);
    const response = await getEndPoint(
      `/api/productlist/?limit=${searchRowsPerPage}&offset=0&search=${data}`,
      null,
      history
    );

    // console.log("res2",response.data.results) // reference
    setSearchCount(response.data.count);
    const list = response.data.results.map(val => ({
      name: val.name,
      quantity: val.quantity,
      sellingPrice: val.latest_selling_price,
      loose: val.loose,
      id: val.id,
      upperLimit: val.upper_limit === null ? '' : val.upper_limit,
      lowerLimit: val.lower_limit === null ? '' : val.lower_limit,
    }));
    console.log(list);
    setInventoryList(list); // set state
  };

  const apiFetch = async () => {
    try {
      setIsLoading(true);

      const response = await getEndPoint(
        '/api/productlist/?limit=10&offset=0',
        null,
        history
      );
      // Use utility function

      // console.log("error",response) check error code here for reference
      console.log(response.data.results);

      const { data } = response;
      setCount(data.count);
      const list = data.results.map(val => ({
        name: val.name,
        quantity: val.quantity,
        sellingPrice: val.latest_selling_price,
        loose: val.loose,
        id: val.id,
        upperLimit: val.upper_limit === null ? '' : val.upper_limit,
        lowerLimit: val.lower_limit === null ? '' : val.lower_limit,
      }));
      setSearchList(list);
      setInventoryList(list);
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

  // handle product delete
  const handleDelete = async row => {
    setIsLoading(true);
    const { id } = row;
    setDeletedRow(prevState => [...prevState, inventoryList.indexOf(row)]);
    try {
      await axios.delete(`/api/productlist/${id}/`);

      // add success snackbar on successful request
      const { name } = inventoryList.find(val => val.id === id);
      setIsLoading(false);
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
  const handleEdit = row => {
    history.push('/updateproduct', {
      name: row.name,
      sellingPrice: row.sellingPrice,
      loose: row.loose,
      id: row.id,
      upperLimit: row.upperLimit,
      lowerLimit: row.lowerLimit,
    });
  };

  return (
    <>
      {isLoading ? <Spinner /> : null}

      <div className={classes.search}>
        <TextField
          onChange={e => handleSearch(e.target.value)}
          style={{ width: '350px' }}
          id='standard-basic'
          label='Search'
          variant='filled'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {search === '' ? (
        <>
          {' '}
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
                  {searchList.map((row, index) => (
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
                            handleDelete={() => {
                              setSelectedRow(row);
                              handleClickOpen();
                            }}
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
          <DialogBox
            open={open}
            handleClose={handleClose}
            selectedRow={selectedRow}
            handleDelete={handleDelete}
            number='1'
          />
        </>
      ) : (
        <>
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
                            handleDelete={() => {
                              setSelectedRow(row);
                              handleClickOpen();
                            }}
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
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component='div'
              count={searchCount}
              page={searchPage}
              rowsPerPage={searchRowsPerPage}
              onChangePage={handleSearchChangePage}
              onChangeRowsPerPage={handleSearchChangeRowsPerPage}
            />
          </Paper>
          <DialogBox
            open={open}
            handleClose={handleClose}
            selectedRow={selectedRow}
            handleDelete={handleDelete}
            number='1'
          />
        </>
      )}
    </>
  );
}
