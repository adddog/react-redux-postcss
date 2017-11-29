import React, { PureComponent, Component } from "react"
import classnames from "classnames"
import { map } from "lodash"

import styles from "./MenuButtonComponent.css";

export default class MenuButtonComponent extends PureComponent {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <button
        className={`hamburger hamburger--slider ${classnames([
          styles.root,
          (this.props.selected ? "is-active" : null),

        ])}`}
        type="button"
        onClick={this.props.onClick}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </button>
    )
  }
}
