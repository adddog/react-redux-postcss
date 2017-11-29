import React, { Component, PureComponent, PropTypes } from "react"
import classnames from "classnames"
import util from "util"
import { autobind } from "core-decorators"
import { NAVIGATION_HEIGHT } from "utils/styling"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const shallowEqualObjects = require("shallow-equal/objects")

import { SpinnerWrapperComponent } from "components/UI/SpinnerComponent"
import PerformanceLineChart from "components/PerformanceLineChart/PerformanceLineChart"

import styles from "./PerformancePageContainer.css"

export default class PerformancePageContainer extends Component {
  static propTypes = {
    performance: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      width: props.browser.width,
      height: props.browser.height,
    }
  }

  _getChartDimensions(props = {}) {
    return {
      chartWidth: props.width || this.state.width,
      chartHeight: props.height || this.state.height,
    }
  }

  componentDidMount() {
    this.props.resize()
    this._setDimensions()
    this.props.performanceHeartsRequest()
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqualObjects(nextProps.browser, this.props.browser))
      this._setDimensions()
  }

  _setDimensions() {
    const { browser } = this.props
    const style =
      this.refs.rootEl.currentStyle ||
      window.getComputedStyle(this.refs.rootEl)
    const width = Math.min(
      this.refs.rootEl.offsetWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight),
      browser.width
    )

    const height = Math.min(
      this.refs.rootEl.offsetHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom),
      browser.height - NAVIGATION_HEIGHT
    )
    this.setState({
      width: width,
      height: height,
      ...this._getChartDimensions({ width, height }),
    })
  }

  render() {
    const { performance, browser } = this.props
    const hearts = performance.get("hearts")
    const chartDimensions = this._getChartDimensions()
    return (
      <section
        data-ui-ref="AppContent"
        ref="rootEl"
        className={classnames([
          styles.root,
          "u-container",
          styles.uCardNoAnim,
          styles["uCardNoAnim--padding"],
        ])}
      >
        <PerformanceLineChart
          title={hearts.title}
          style={{
            maxWidth: `${this.state.chartWidth}px`,
          }}
          padding={20}
          width={this.state.chartWidth}
          height={this.state.chartHeight}
          data={hearts.data}
        />
        <SpinnerWrapperComponent
          isVisible={this.props.components.get("isLoaderVisible")}
        />
      </section>
    )
  }
}
