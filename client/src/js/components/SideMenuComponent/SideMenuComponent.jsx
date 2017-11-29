import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import ReactTable from "react-table"
import S from "string"
import matchSorter from "match-sorter"
import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes,
} from "recompose"
import { autobind } from "core-decorators"
import { connect } from "react-redux"
import { CONSTANTS } from "utils/utils"
import { NavLink, Link } from "react-router-dom"

import styles from "./SideMenuComponent.css"
import styleObject from "./SideMenuComponent.sss"

class SideMenuComponent extends Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
  }

  render() {
    const { routes, components } = this.props
    return (
      <div
        className={classnames([
          styles.root,
          styles.uCardNoAnim,
          styles.BoxShadowLeft,
          components.get("isSideMenuOpen")
            ? styles["is--open"]
            : null,
        ])}
      >
        <div className={classnames([styles.menu])}>
          {routes
            .toArray()
            .filter(({ label }) => !!label)
            .map(({ slug, component, label }, i) => {
              return (
                <Link
                  className={classnames([
                    styles.item,
                    //"hvr-underline-from-center"
                  ])}
                  key={slug}
                  to={slug}
                >
                  <span>
                    {label}
                  </span>
                </Link>
              )
            })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = () => {
  return (state, ownProps) => {
    return {
      ...ownProps,
      components: state.components,
      routes: state.routes,
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({})

export default compose(
  setDisplayName("SideMenuComponent"),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForPropTypes
)(SideMenuComponent)
