import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import { isArray } from "lodash"

import styles from "./InfoTextComponent.css"

const InfoTextComponent = props => {
  let className = props.className || []
  let classes = props.classes || []
  className = isArray(className) ? className : [className]
  classes = isArray(classes) ? classes : [classes]
  return (
    <span
      className={classnames([
        styles.root,
        ...className,
        ...classes.map(c => styles[c]),
      ])}
    >
      {props.text || ""}
    </span>
  )
}

export default InfoTextComponent
