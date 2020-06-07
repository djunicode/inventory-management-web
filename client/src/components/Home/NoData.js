import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
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

const NoData = () => {
  const classes = useStyles();

  const history = useHistory();

  const handleClick = () => {
    history.push('/transaction');
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
    </div>
  );
};

export default NoData;
