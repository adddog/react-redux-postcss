import React, { PureComponent, Component } from "react"
import classnames from "classnames"

import styles from "./SettingComponent.css"

import SeparatorComponent from "./SeparatorComponent"

export default class SettingComponent extends PureComponent {
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
      {this.props.component}
      {/*<SeparatorComponent
        horizontal={true}
      />*/}
      </div>
    )
  }
}
