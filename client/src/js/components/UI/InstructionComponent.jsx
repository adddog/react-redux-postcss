import React, { PureComponent, Component } from "react"
import classnames from "classnames"

import styles from "./InstructionComponent.css"

export default class InstructionComponent extends PureComponent {
  static defaultProps = {
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={classnames([
          styles.root,
        ])}
      >
        {this.props.text}
      </div>
    )
  }
}
