import React, { PropTypes } from "react"
import classnames from "classnames"
import styles from "./CalendarIconComponent.css"

const CalendarIconComponent = props => {
  return (
    <div
      className={classnames([
        styles.root,
        props.isSelected ? styles["selected"] : null
      ])}
    >
      {props.label
        ? <span>
            {props.label}
          </span>
        : null}
      <div
        className={classnames([styles.icon])}
        onClick={props.onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="-285 408.9 24 24"
        >
          <path d="M-268 420.9h2v2h-2z" />
          <path d="M-268 412.9v-1.2c0-.5-.3-.8-.8-.8-.4 0-.8.3-.8.8v1.2h-7v-1.2c.1-.5-.2-.8-.6-.8-.5 0-.8.3-.8.8v1.2h-5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-16h-5zm-10 14h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-2h2v2h-2v-2zm3 7h-4v-4h4v4z" />
        </svg>
      </div>
    </div>
  )
}

export default CalendarIconComponent
