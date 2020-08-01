import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import illustration from '../../images/Graph.svg';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 10rem)',
    textAlign: 'center',
  },
  button: {
    maxWidth: '18rem',
    height: '3rem',
    borderRadius: '1rem',
    fontWeight: '700',
    marginTop: theme.spacing(1.5),
    boxShadow: '0 5px 65px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '12rem',
    },
  },
  img: {
    maxWidth: '30%',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      maxWidth: '50%',
    },
  },
}));

const NoData = ({ setData }) => {
  const classes = useStyles();

  const history = useHistory();

  const handleClick = () => {
    history.push('/transaction');
  };

  const useDummyData = () => {
    const temp = {
      Total: {
        Total: {
          earned: 200.0,
          sold: 10,
          spent: 10000.0,
          bought: 210,
        },
        Munch: {
          earned: 50.0,
          spent: 200.0,
          sold: 5,
          bought: 20,
        },
        Kitkat: {
          earned: 300.0,
          spent: 100.0,
          sold: 0,
          bought: 10,
        },
        Lays: {
          earned: 150.0,
          spent: 600.0,
          sold: 5,
          bought: 40,
        },
        Chips: {
          earned: 200.0,
          spent: 400.0,
          sold: 0,
          bought: 20,
        },
        Milk: {
          earned: 900.0,
          spent: 700.0,
          sold: 0,
          bought: 120,
        },
        Bag: {
          earned: 1500.0,
          spent: 700.0,
          sold: 0,
          bought: 120,
        },
        Chocolate: {
          earned: 300.0,
          spent: 150.0,
          sold: 0,
          bought: 120,
        },
        Water: {
          earned: 200.0,
          spent: 100.0,
          sold: 0,
          bought: 120,
        },
        Bread: {
          earned: 1000.0,
          spent: 800.0,
          sold: 0,
          bought: 120,
        },
      },
      '2020-01': {
        Total: {
          earned: 290.0,
          sold: 10,
          spent: 380.0,
          bought: 210,
        },
      },
      '2020-02': {
        Total: {
          earned: 310.0,
          sold: 10,
          spent: 230.0,
          bought: 210,
        },
      },
      '2020-03': {
        Total: {
          earned: 340.0,
          sold: 10,
          spent: 250.0,
          bought: 210,
        },
      },
      '2020-04': {
        Total: {
          earned: 320.0,
          sold: 10,
          spent: 280.0,
          bought: 210,
        },
      },

      '2020-05': {
        Total: {
          earned: 300.0,
          sold: 10,
          spent: 300.0,
          bought: 210,
        },
      },
      '2020-06': {
        Total: {
          earned: 200.0,
          sold: 10,
          spent: 100.0,
          bought: 210,
        },
      },
      '2020-07': {
        Total: {
          earned: 355.0,
          sold: 10,
          spent: 265.0,
          bought: 210,
        },
      },
      '2020-08': {
        Total: {
          earned: 370.0,
          sold: 10,
          spent: 300.0,
          bought: 210,
        },
      },
      '2020-09': {
        Total: {
          earned: 342.0,
          sold: 10,
          spent: 296.0,
          bought: 210,
        },
      },
      '2020-10': {
        Total: {
          earned: 321.0,
          sold: 10,
          spent: 257.0,
          bought: 210,
        },
      },
      '2020-11': {
        Total: {
          earned: 361.0,
          sold: 10,
          spent: 285.0,
          bought: 210,
        },
      },
      '2020-12': {
        Total: {
          earned: 398.0,
          sold: 10,
          spent: 302.0,
          bought: 210,
        },
      },
    };
    setData(temp);
  };

  return (
    <div className={classes.container}>
      <img src={illustration} alt='illustration' className={classes.img} />
      <h1>More data needed to display graphs</h1>
      <h3>
        Atleast 2 months data needed to display the graphs. Perform transactions
        to generate data
      </h3>
      <Button
        type='button'
        color='primary'
        variant='contained'
        className={classes.button}
        onClick={handleClick}
      >
        Transaction
      </Button>
      <Button
        type='button'
        color='primary'
        variant='outlined'
        className={classes.button}
        onClick={useDummyData}
      >
        View with Dummy Data
      </Button>
    </div>
  );
};

NoData.propTypes = {
  setData: PropTypes.func.isRequired,
};

export default NoData;
