import React, { PureComponent, PropTypes } from "react"
import classnames from "classnames"

import styles from "./PerformanceGraphTitle.css"

export default class PerformanceGraphTitle extends PureComponent {
  static defaultProps = {
    title: "",
  }

  render() {
    return (
      <div className={classnames([styles.root])}>
        <p>
          {this.formatTitle(this.props.title)}
        </p>
      </div>
    )
  }

  formatTitle(title) {
    return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
}
