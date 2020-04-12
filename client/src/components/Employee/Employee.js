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
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
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

export default function Employee() {
  // list of employees got from API
  const [employeeList, setEmployeeList] = useState([]);
  // contains the index of the row, if delete is used
  const [deletedRow, setDeletedRow] = useState([]);

  const history = useHistory();

  const apiFetch = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Token ${token}` } };
      const response = await axios.get('/auth/users/', config);
      const { data } = response;
      // map genders got from API
      const genderMapper = { M: 'Male', F: 'Female', Other: 'Other' };
      const list = data.map(val => ({
        name: `${val.first_name} ${val.last_name}`,
        age: val.age,
        gender: genderMapper[val.gender],
        email: val.email,
      }));
      setEmployeeList(list);
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
    history.push('/addemployee');
  };

  // handle user edit
  const handleEdit = row => {
    console.log(row);
    // TODO implement this when endpoint is ready
    // open the create user form and pass the data as props
  };

  // handle user delete
  const handleDelete = async row => {
    const { email } = row;
    setDeletedRow(prevState => [...prevState, employeeList.indexOf(row)]);
    try {
      const formData = new FormData();
      formData.append('email', email);
      await axios.post('/auth/user_delete/', formData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
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
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell align='right'>{row.age}</TableCell>
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
