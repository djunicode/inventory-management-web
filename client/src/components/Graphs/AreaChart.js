import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {
  Divider,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { PropTypes } from 'prop-types';
import GraphTooltip from './GraphTooltip';

const useStyles = makeStyles(theme => ({
  circle: {
    fill: '#64C6F7',
    stroke: 'white',
    strokeWidth: '3',
    [theme.breakpoints.only('xs')]: {
      strokeWidth: '2',
    },
    '&:hover': {
      fill: '#7B42F6',
    },
  },
  svg: {
    '& #line': {
      fill: 'none',
      stroke: '#64C6F7',
      strokeWidth: '5',
    },
    '& #area': {
      fill: '#cceeff',
    },
    '& text': {
      fill: '#5a5a5a',
    },
  },
}));

const AreaChart = ({ data, type }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

  // refs for DOM elements
  const svgRef = useRef(null);
  const axisBottomRef = useRef(null);
  const axisLeftRef = useRef(null);

  // constants
  const width = isMobile ? 600 : 1400;
  const height = isMobile ? 200 : 350;
  const radius = isMobile ? 5 : 8;
  const transitionDuration = 3000;

  const margin = { top: 20, right: 40, bottom: 80, left: 80 };

  useEffect(() => {
    // keeps the length of the covered path
    let currentLength = 0;

    // set up the X Scale
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    // set up the Y Scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => +d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Line generator
    const line = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom);

    // Area generator
    const area = d3
      .area()
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.value))
      .curve(d3.curveCatmullRom);

    const svg = d3.select(svgRef.current);

    // add data to area
    svg
      .select('#area')
      .datum(data)
      .attr('d', area);

    // add data to line
    svg
      .select('#line')
      .datum(data)
      .attr('d', line);

    // get total length of the line path
    const length = d3
      .select(svgRef.current)
      .select('#line')
      .node()
      .getTotalLength();

    // add line transition
    svg
      .select('path')
      .attr('stroke-dasharray', `${length} ${length}`)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // add circle with transition
    svg
      .selectAll('circle')
      .data(data)
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', radius)
      .attr('opacity', 0)
      .transition()
      .delay((d, i) => {
        if (i === 0) return 0;

        const pathLength = Math.sqrt(
          (x(data[i].date) - x(data[i - 1].date)) ** 2 +
            (y(data[i].value) - y(data[i - 1].value)) ** 2
        );
        currentLength += pathLength;
        return (transitionDuration * currentLength) / length;
      })
      .attr('opacity', 1);

    // X Axis
    d3.select(axisBottomRef.current)
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .attr('color', '#5a5a5a')
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b')));

    // Y Axis
    d3.select(axisLeftRef.current)
      .attr('transform', `translate(${margin.left},0)`)
      .attr('color', '#5a5a5a')
      .call(d3.axisLeft(y));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width]);

  // circles with tooltips
  const circles = data.map(d => (
    <GraphTooltip
      title={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <>
          <h4>{`${d.date.toDateString().slice(4)}`}</h4>
          <Divider />
          <p>{`${d.value}K ₹`}</p>
        </>
      }
      key={d.date}
    >
      <circle key={d.date} className={classes.circle} />
    </GraphTooltip>
  ));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={isMobile ? width : null}
      preserveAspectRatio='xMinYMin'
      ref={svgRef}
      className={classes.svg}
    >
      <path id='line' />
      <path id='area' />
      <g ref={axisBottomRef} />
      <g ref={axisLeftRef} />
      {circles}
      <text
        textAnchor='middle'
        transform={`translate(${width / 2},${height - 20})`}
      >
        Date
      </text>
      <text
        textAnchor='middle'
        transform='rotate(-90)'
        y='30'
        x={0 - height / 2 + margin.bottom / 2}
      >
        {`${type} (₹)`}
      </text>
    </svg>
  );
};

AreaChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.string.isRequired,
};

export default AreaChart;
