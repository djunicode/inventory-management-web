import React, { useEffect, useState } from 'react';
import { Typography, Paper, TextField, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import AreaChart from '../Graphs/AreaChart';
import BarChart from '../Graphs/BarChart';
import NoData from './NoData';

const useStyles = makeStyles(theme => ({
  heading: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
  graph: {
    marginBottom: theme.spacing(4),
  },
  graphContainer: {
    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    padding: '1rem',
    [theme.breakpoints.only('xs')]: {
      overflow: 'scroll',
      padding: '5px',
    },
    '& .MuiTextField-root': {
      margin: '1rem 2rem',
      width: '100%',
      maxWidth: '20rem',
      [theme.breakpoints.only('xs')]: {
        margin: '0.5rem 1rem',
        maxWidth: '12rem',
      },
    },
  },
}));

const Home = () => {
  // dummy data
  const [data, setData] = useState({});
  const [salesAreaData, setSalesAreaData] = useState([]);
  const [salesBarData, setSalesBarData] = useState([]);

  const [areaType, setAreaType] = useState('Earned');
  const [barType, setBarType] = useState('Earned');

  const apiFetch = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Token ${token}` } };
      const response = await axios.get('/api/profit/', config);
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  // call API on component load
  useEffect(() => {
    apiFetch();
  }, []);

  // useEffect to set appropriate graphs data after getting data from API
  useEffect(() => {
    if (data.Total) {
      // parse the data to generate data for the bar graph
      const t1 = [];
      const t2 = [];
      Object.entries(data.Total).forEach(val => {
        const [key, value] = val;
        if (key !== 'Total') {
          t1.push({ name: key, value: value.earned });
          t2.push({ name: key, value: value.spent });
        }
      });
      const barDataType = barType === 'Earned' ? t1 : t2;
      setSalesBarData(barDataType);

      // parse the data to generate data for the area graph
      const t3 = [];
      const t4 = [];
      Object.entries(data).forEach(val => {
        const [key, value] = val;
        if (key !== 'Total') {
          t3.push({ date: new Date(key), value: value.Total.earned });
          t4.push({ date: new Date(key), value: value.Total.spent });
        }
      });
      const areaDataType = areaType === 'Earned' ? t3 : t4;
      setSalesAreaData(areaDataType);
    }
  }, [areaType, barType, data]);

  const classes = useStyles();

  const handleAreaChange = event => {
    setAreaType(event.target.value);
  };

  const handleBarChange = event => {
    setBarType(event.target.value);
  };

  return (
    <>
      {salesAreaData.length < 2 ? (
        <NoData />
      ) : (
        <>
          <div className={classes.graph}>
            <Typography variant='h4' className={classes.heading}>
              Sales over time
            </Typography>
            <Paper className={classes.graphContainer}>
              <TextField
                required
                variant='filled'
                id='type-area-input'
                name='areaType'
                select
                label='Graph Type'
                value={areaType}
                onChange={handleAreaChange}
              >
                <MenuItem key='Earned' value='Earned'>
                  Earned
                </MenuItem>
                <MenuItem key='Spent' value='Spent'>
                  Spent
                </MenuItem>
              </TextField>
              <AreaChart data={salesAreaData} type={areaType} />
            </Paper>
          </div>
          <div className={classes.graph}>
            <Typography variant='h4' className={classes.heading}>
              Sales per product
            </Typography>
            <Paper className={classes.graphContainer}>
              <TextField
                required
                variant='filled'
                id='type-bar-input'
                name='barType'
                select
                label='Graph Type'
                value={barType}
                onChange={handleBarChange}
              >
                <MenuItem key='Earned' value='Earned'>
                  Earned
                </MenuItem>
                <MenuItem key='Spent' value='Spent'>
                  Spent
                </MenuItem>
              </TextField>
              <BarChart data={salesBarData} type={barType} />
            </Paper>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
