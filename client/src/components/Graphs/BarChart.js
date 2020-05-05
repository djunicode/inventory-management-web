import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { makeStyles, Divider } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import GraphTooltip from './GraphTooltip';

const useStyles = makeStyles(() => ({
  rect: {
    fill: '#64C6F7',
    '&:hover': {
      fill: '#7B42F6',
    },
  },
  svg: {
    '& text': {
      fill: '#5a5a5a',
    },
  },
}));

const BarChart = ({ data }) => {
  const classes = useStyles();

  // refs for DOM elements
  const svgRef = useRef(null);
  const axisBottomRef = useRef(null);
  const axisLeftRef = useRef(null);

  // constants
  const width = 1400;
  const height = 350;
  const transitionDuration = 3000;

  const margin = { top: 20, right: 40, bottom: 80, left: 80 };

  useEffect(() => {
    // set up the X Scale
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // set up the Y Scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => +d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // add rectangles with transition
    d3.select(svgRef.current)
      .selectAll('rect')
      .data(data)
      .attr('x', d => x(d.name))
      .attr('y', y(0))
      .attr('width', x.bandwidth())
      .attr('height', height - y(0) - margin.bottom)
      .transition()
      .duration(transitionDuration)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value) - margin.bottom)
      .delay((d, i) => i * 100);

    // X Axis
    d3.select(axisBottomRef.current)
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .attr('color', '#5a5a5a')
      .call(d3.axisBottom(x));

    // Y Axis
    d3.select(axisLeftRef.current)
      .attr('transform', `translate(${margin.left},0)`)
      .attr('color', '#5a5a5a')
      .call(d3.axisLeft(y));
  }, [data, margin.bottom, margin.left, margin.right, margin.top]);

  // rectangles with tooltips
  const rects = data.map(d => (
    <GraphTooltip
      title={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <>
          <h4>{`${d.name}`}</h4>
          <Divider />
          <p>{`${d.value}K ₹`}</p>
        </>
      }
      key={d.name}
    >
      <rect fill='steelblue' key={d.name} className={classes.rect} />
    </GraphTooltip>
  ));

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='xMinYMin'
        ref={svgRef}
        className={classes.svg}
      >
        <g ref={axisBottomRef} />
        <g ref={axisLeftRef} />
        {rects}
        <text
          textAnchor='middle'
          transform={`translate(${width / 2},${height - 20})`}
        >
          Type
        </text>
        <text
          textAnchor='middle'
          transform='rotate(-90)'
          y='30'
          x={0 - height / 2 + margin.bottom / 2}
        >
          Sales
        </text>
      </svg>
    </div>
  );
};

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BarChart;
