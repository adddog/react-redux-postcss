import React, { PureComponent, Component } from "react"
import classnames from "classnames"
import { PureMaterialUIComponent } from "components/BaseMaterialUI"
import styles from "./SeparatorComponent.css"

export default class SeparatorComponent extends PureComponent {
  static defaultProps = {
    horizontal: false
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={classnames([
          styles.root,
          this.props.horizontal
            ? styles["root--horizontal"]
            : styles["root--vertical"],
            this.props.below
            ? styles["root--below"]
            : styles["root--above"]
        ])}
      >
        <span>
          {this.props.label || ""}
        </span>
      </div>
    )
  }
}
