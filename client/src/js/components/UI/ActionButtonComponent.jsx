import React, { PureComponent, Component } from "react"
import classnames from "classnames"
import { isArray } from "lodash"

import FileDownload from "material-ui-icons/FileDownload"
import RaisedButton from "material-ui/RaisedButton"

import styles from "./ActionButtonComponent.css"
import stylesObject from "./ActionButtonComponent.sss"

export default class ActionButtonComponent extends PureComponent {
  static defaultProps = {
    className: [],
    classes: [],
  }

  constructor(props) {
    super(props)
  }

  _renderLabel() {
    if (!this.props.label) return null
    return (
      <span className={styles["root__label"]}>
        {this.props.label}
      </span>
    )
  }

  _renderIcon() {
    if (this.props.icon) return this.props.icon
    if (!this.props.iconClass) return null
    const iconClasses = isArray(this.props.iconClass)
      ? this.props.iconClass
      : [this.props.iconClass]
    return (
      <span className={styles.iconWrapper}>
        <span className={classnames([styles.icon, ...iconClasses])} />
      </span>
    )
  }

  render() {
    return (
      <div
        className={classnames([
          styles.root,
          styles[`root--${this.props.type}`],
          !!this.props.iconClass ? styles[`root--margin`] : null,
          this.props.small ? styles[`root--small`] : null,
          ...this.props.classes.map(c => styles[c]),
          ...this.props.className,
        ])}
        onClick={this.props.onClick}
      >
        {this._renderIcon()}
        {this._renderLabel()}
      </div>
    )
  }
}
