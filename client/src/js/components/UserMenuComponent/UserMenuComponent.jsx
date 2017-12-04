import React, { PureComponent, Component } from "react"
import classnames from "classnames"
import { map } from "lodash"

import styles from "./UserMenuComponent.css";

export default class UserMenuComponent extends PureComponent {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <div
        className={` ${classnames([
          styles.root
        ])}`}
      >
        <span onClick={this.props.logout}>
          'Logout'
        </span>
      </div>
    )
  }
}
