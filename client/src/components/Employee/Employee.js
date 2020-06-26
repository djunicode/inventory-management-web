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
  Fab,
  IconButton,
  Hidden,
  TablePagination,
  Box,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import Spinner from '../Spinner';
import MobileEditMenu from '../MobileEditMenu';
import { SnackContext } from '../SnackBar/SnackContext';
import DialogBox from '../DialogBox/DialogBox';
import { getEndPoint, postEndPoint } from '../UtilityFunctions/Request';

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

export default function Employee() {
  // list of employees got from API
  const [employeeList, setEmployeeList] = useState([]);
  // contains the index of the row, if delete is used
  const [deletedRow, setDeletedRow] = useState([]);
  // true when waiting for an response from API
  const [isLoading, setIsLoading] = useState(false);
  // dialog box
  const [open, setOpen] = useState(false);
  // row to be selected on clicking the delete icon
  const [selectedRow, setSelectedRow] = useState({});
  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  const handleChangePage = async (event, newPage) => {
    try {
      setIsLoading(true);
      setPage(newPage);
      const response = await getEndPoint(
        `/auth/users/?limit=${rowsPerPage}&offset=${newPage * rowsPerPage}`,
        null,
        history
      );
      const { data } = response;
      setCount(data.count);
      // map genders got from API
      const genderMapper = { M: 'Male', F: 'Female', Other: 'Other' };
      const list = data.results.map(val => ({
        firstName: val.first_name,
        lastName: val.last_name,
        name: `${val.first_name} ${val.last_name}`,
        age: val.age,
        gender: genderMapper[val.gender],
        email: val.email,
        isStaff: val.is_staff,
      }));
      setEmployeeList(list);
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
        `/auth/users/?limit=${+event.target.value}&offset=0`,
        null,
        history
      );
      const { data } = response;
      setCount(data.count);
      // map genders got from API
      const genderMapper = { M: 'Male', F: 'Female', Other: 'Other' };
      const list = data.results.map(val => ({
        firstName: val.first_name,
        lastName: val.last_name,
        name: `${val.first_name} ${val.last_name}`,
        age: val.age,
        gender: genderMapper[val.gender],
        email: val.email,
        isStaff: val.is_staff,
      }));
      setEmployeeList(list);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const apiFetch = async () => {
    try {
      setIsLoading(true);
      const response = await getEndPoint(
        '/auth/users/?limit=10&offset=0',
        null,
        history
      );
      const { data } = response;
      setCount(data.count);
      // map genders got from API
      const genderMapper = { M: 'Male', F: 'Female', Other: 'Other' };
      const list = data.results.map(val => ({
        firstName: val.first_name,
        lastName: val.last_name,
        name: `${val.first_name} ${val.last_name}`,
        age: val.age,
        gender: genderMapper[val.gender],
        email: val.email,
        isStaff: val.is_staff,
      }));
      setEmployeeList(list);
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

  // handle click on the FAB
  const handleFabClick = () => {
    history.push('/addemployee');
  };

  // handle user edit
  const handleEdit = row => {
    console.log(row);
    // open the create user form and pass the data as props
    history.push('/updateemployee', {
      firstName: row.firstName,
      lastName: row.lastName,
      age: row.age,
      isStaff: row.isStaff,
      email: row.email,
    });
  };

  // handle user delete
  const handleDelete = async row => {
    setIsLoading(true);
    const { email, name } = row;
    setDeletedRow(prevState => [...prevState, employeeList.indexOf(row)]);
    try {
      const formData = new FormData();
      formData.append('email', email);
      await postEndPoint('/auth/user_delete/', formData, null, history);
      setIsLoading(false);
      // add success snackbar on successful request
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

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <Typography variant='h3' className={classes.heading}>
        Employees
      </Typography>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align='right'>Age</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeList.map((row, index) => (
                <TableRow
                  key={row.email}
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
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell align='right'>{row.age}</TableCell>
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
        <Box m={10} />
      </Paper>

      <DialogBox
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
        handleDelete={handleDelete}
        number='1'
      />

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
