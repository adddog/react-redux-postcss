import React, { PureComponent, Component } from "react"
import classnames from "classnames"
import { PureMaterialUIComponent } from "components/BaseMaterialUI"
import { omit } from "lodash"

import TextField from "material-ui/TextField"

import styles from "./TextFieldComponent.css"

export default class TextFieldComponent extends PureMaterialUIComponent {
  static get defaultProps() {
    return {
      className: [],
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
          this.props.requiresPrompt
            ? styles["root--requiresCaption"]
            : null,
          ...this.props.className,
        ])}
      >
        <TextField
          {...omit(this.props, [
            "iconClass",
            "className",
            "requiresPrompt",
          ])}
        />
        <span className={this.props.iconClass} />
      </div>
    )
  }
}
