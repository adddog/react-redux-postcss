import React, { PureComponent, PropTypes } from "react"
import classnames from "classnames"

import styles from "./PerformanceGraphTooltip.css";

export default class PerformanceGraphTooltip extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string,
  }

  render() {
    const { active, payload } = this.props

    if (active && payload) {
      const { payload, label } = this.props
      const data = payload[0]
      return (
        <div
          className={classnames([
            styles["root"],
            styles["uCardNoAnim"],
          ])}
        >
          <p style={{ color: data.color, alignText: "center" }}>
            {`${data.payload.amt} ${data.name}`}
          </p>
          <p>
            {data.payload.humanDate}
          </p>
        </div>
      )
    }
    return null
  }
}
