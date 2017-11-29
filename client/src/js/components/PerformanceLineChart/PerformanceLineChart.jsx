import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import util from 'util';
import { omit } from 'lodash';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import PerformanceGraphTooltip from 'components/PerformanceGraphTooltip/PerformanceGraphTooltip';
import PerformanceGraphTitle from 'components/PerformanceGraphTitle/PerformanceGraphTitle';

import styles from './PerformanceLineChart.css';
import styleObject from './PerformanceLineChart.sss';

const CustomizedLabel = props => {
  const { x, y, stroke, value } = props;
  return (
    <text
      x={x}
      y={y}
      dy={-4}
      fill={stroke}
      fontSize={8}
      textAnchor="middle"
      {...styleObject['.axis']}
    >
      {value}
    </text>
  );
};
const CustomizedAxisTick = props => {
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-15)"
        {...styleObject['.axis']}
      >
        {payload.value}
      </text>
    </g>
  );
};

const CustomizedYAxis = props => {
  const { x, y, tickCoord, coordinate, offset, stroke, payload } = props;
  return (
    <g>
      <text
        {...omit(props, ['index', 'payload', 'verticalAnchor'])}
        {...styleObject['.axis']}
      >
        {payload.value}
      </text>
    </g>
  );
};

export default class PerformanceLineChart extends Component {
  static defaultProps = {
    padding: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      titleHeight: 0
    };
  }

  componentDidMount() {
    this.setState({
      titleHeight: this.refs.titleEl.offsetHeight
    });
  }

  render() {
    let { width, height, padding } = this.props;
    width -= padding;
    height -= padding;
    return (
      <div className={classnames([styles.root])}>
        <div ref="titleEl" className={classnames([styles.title])}>
          <PerformanceGraphTitle title={this.props.title} />
        </div>
        <div
          className={classnames([
            styles['uCardNoAnim'],
            styles['uCardNoAnim--light']
          ])}
        >
          <LineChart
            {...this.props}
            {...{ width, height: height - this.state.titleHeight }}
          >
            <XAxis
              dataKey="name"
              height={60}
              label={<CustomizedLabel />}
              tick={<CustomizedAxisTick />}
            />
            <YAxis tick={<CustomizedYAxis />} />
            <CartesianGrid />
            <Tooltip content={<PerformanceGraphTooltip />} />
            <Line
              type="monotone"
              name="hearts"
              dataKey="amt"
              stroke="#82ca9d"
              {...styleObject['.line']}
            />
          </LineChart>
        </div>
      </div>
    );
  }
}
