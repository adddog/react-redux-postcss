import React, { PureComponent, Component } from "react"
import classnames from "classnames"
import { Link } from "react-router-dom"
import { ROUTES } from "routes/configureRoutes"

import styles from "./LogoComponent.css"

export default class LogoComponent extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Link to={ROUTES.root.slug}>
        <div className={classnames(styles.root)} />
      </Link>
    )
  }
}
