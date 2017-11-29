import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import { isArray } from "lodash"

import styles from "./ModalIconLabelComponent.css"

const ModalIconLabelComponent = props => {
  let className = props.className || []
  let classes = props.classes || []
  className = isArray(className) ? className : [className]
  classes = isArray(classes) ? classes : [classes]
  return (
    <div
      className={classnames([styles.root, ...className, ...classes.map(c=>styles[c])])}
      onClick={props.onClick}
    >
      <i className="material-icons">
        {props.icon}
      </i>
      {props.label
        ? <span>
            {props.label}
          </span>
        : null}
    </div>
  )
}

export default ModalIconLabelComponent
