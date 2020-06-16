import React, { useState, useEffect, useContext } from 'react';
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
  Hidden,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import MobileEditMenu from '../MobileEditMenu';
import { SnackContext } from '../SnackBar/SnackContext';
import Spinner from '../Spinner';
import DialogBox from '../DialogBox/DialogBox';
import {getEndPoint} from '../UtilityFunctions/Request'

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
      setIsLoading(true);
      
      
      const response = await getEndPoint('/api/productlist/',null,history); // Use utility function

      //console.log("error",response) check error code here for reference

      const { data } = response;
      const list = data.map((val) => ({
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

  // call API on component load
  useEffect(() => {
    apiFetch();
  }, []);

  const classes = useStyles();

  // handle product delete
  const handleDelete = async (row) => {
    setIsLoading(true);
    const { id } = row;
    setDeletedRow((prevState) => [...prevState, inventoryList.indexOf(row)]);
    try {
      await axios.delete(`/api/productlist/${id}/`);

      // add success snackbar on successful request
      const { name } = inventoryList.find((val) => val.id === id);
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
  const handleEdit = (row) => {
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
      <DialogBox
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
        handleDelete={handleDelete}
        number='1'
      />
    </>
  );
}
