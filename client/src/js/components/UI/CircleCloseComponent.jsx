import React, { PureComponent, Component, PropTypes } from "react"
import classnames from "classnames"
import { PureMaterialUIComponent } from "components/BaseMaterialUI"
import styles from "./CircleCloseComponent.css"

export default class CircleCloseComponent extends PureComponent {

  static propTypes = {
    onClick:PropTypes.func.isRequired,
  }

  static get defaultProps() {
    return {
      className: []
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={classnames([
          styles.root,
          ...this.props.className,
        ])}
        onClick={this.props.onClick}
      >
      </div>
    )
  }
}
