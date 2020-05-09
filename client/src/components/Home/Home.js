import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AreaChart from '../Graphs/AreaChart';
import BarChart from '../Graphs/BarChart';

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
    [theme.breakpoints.only('xs')]: {
      overflow: 'scroll',
    },
  },
}));

const Home = () => {
  // dummy data
  const [data, setData] = useState({
    Cadbury: {
      total: 2320,
    },
    Lays: {
      total: 1890,
    },
    totalProfit: {
      '2020-01': 300,
      '2020-02': 220,
      '2020-03': 180,
      '2020-04': 202,
      '2020-05': 223,
      '2020-06': 262,
      '2020-07': 172,
      '2020-08': 290,
      '2020-09': 277,
      '2020-10': 283,
      '2020-11': 301,
      '2020-12': 340,
      total: 3050,
    },
  });

  const [salesAreaData, setSalesAreaData] = useState([]);
  const [salesBarData, setSalesBarData] = useState([]);

  const apiFetch = async () => {
    try {
      // TODO implement this when endpoint is ready
      // setting dummy data
      setData({
        Football: {
          '2020-01': 150,
          '2020-02': 60,
          '2020-03': 25,
          '2020-04': 82,
          '2020-05': 93,
          '2020-06': 160,
          '2020-07': 76,
          '2020-08': 190,
          '2020-09': 162,
          '2020-10': 120,
          '2020-11': 145,
          '2020-12': 160,
          total: 1423,
        },
        Shoes: {
          '2020-01': 150,
          '2020-02': 160,
          '2020-03': 155,
          '2020-04': 120,
          '2020-05': 130,
          '2020-06': 102,
          '2020-07': 96,
          '2020-08': 100,
          '2020-09': 115,
          '2020-10': 163,
          '2020-11': 156,
          '2020-12': 180,
          total: 1627,
        },
        Kurkure: {
          total: 2042,
        },
        Oreo: {
          total: 2463,
        },
        ParleG: {
          total: 1756,
        },
        Lassi: {
          total: 860,
        },
        Laptop: {
          total: 1983,
        },
        Mobile: {
          total: 2630,
        },
        Milk: {
          total: 2005,
        },
        Cadbury: {
          total: 2320,
        },
        Lays: {
          total: 1890,
        },
        totalProfit: {
          '2020-01': 300,
          '2020-02': 220,
          '2020-03': 180,
          '2020-04': 202,
          '2020-05': 223,
          '2020-06': 262,
          '2020-07': 172,
          '2020-08': 290,
          '2020-09': 277,
          '2020-10': 283,
          '2020-11': 301,
          '2020-12': 340,
          total: 3050,
        },
      });
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
    // parse the data to generate data for the area graph
    const temp1 = [];

    Object.entries(data.totalProfit).forEach(val => {
      const [key, value] = val;
      if (key !== 'total') {
        temp1.push({ date: new Date(key), value });
      }
    });

    setSalesAreaData(temp1);

    // parse the data to generate data for the bar graph
    const temp2 = [];

    Object.keys(data).forEach(key => {
      if (key !== 'totalProfit') {
        temp2.push({ name: key, value: data[key].total });
      }
    });
    setSalesBarData(temp2);
  }, [data]);

  const classes = useStyles();

  return (
    <>
      <div className={classes.graph}>
        <Typography variant='h4' className={classes.heading}>
          Sales over time
        </Typography>
        <Paper className={classes.graphContainer}>
          <AreaChart data={salesAreaData} />
        </Paper>
      </div>
      <div className={classes.graph}>
        <Typography variant='h4' className={classes.heading}>
          Sales per product
        </Typography>
        <Paper className={classes.graphContainer}>
          <BarChart data={salesBarData} />
        </Paper>
      </div>
    </>
  );
};

export default Home;
