import React, { PropTypes } from "react"
import classnames from "classnames"
import styles from "./BasicIconComponent.css"

import ConfirmationTooltipComponent from "components/UI/ConfirmationTooltipComponent"

const BasicIconComponent = props => {
  const { className = [] } = props
  const { classes = [] } = props
  return (
    <div
      className={classnames([
        styles.root,
        ...className,
        ...classes.map(c => styles[c]),
      ])}
    >
      <div className={classnames([styles.iconTemplate, styles.icon])}>
        <div
          className={classnames([styles.svgIcon, styles[props.icon]])}
        />
      </div>
      {props.showConfirmation && props.confirmation
        ? <ConfirmationTooltipComponent
            {...props.confirmation}
            show={props.showConfirmation}
          />
        : null}
    </div>
  )
}

export default BasicIconComponent
