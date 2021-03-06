import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import Util from "util"
import { NavLink, Link } from "react-router-dom"
import { compact } from "lodash"
import { autobind } from "core-decorators"

import LogoComponent from "components/LogoComponent/LogoComponent"
import MenuButtonComponent from "components/MenuButtonComponent/MenuButtonComponent"
import SchoolSelectComponent from "components/SchoolSelectComponent/SchoolSelectComponent"
import UserMenuComponent from "components/UserMenuComponent/UserMenuComponent"
import styles from "./NavigationContainer.css"

export default class NavigationContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    customStyling: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  componentDidMount() {
    this.props.resize()
  }

  @autobind
  _onSideMenuClick() {
    this.setState({ selected: !this.state.selected })
    this.props.toggleMenu()
  }

  render() {
    const {
      auth,
      routes,
      customStyling,
      router,
      updateIpeds,
    } = this.props
    return (
      <div
        data-ui-ref="NavigationContainer"
        className={classnames(styles.root)}
        //TODO CUSTOM STYLING
        //style={customStyling.navigation}
      >
        <LogoComponent />
        <UserMenuComponent logout={this.props.logout} />
        <div className={classnames(styles.items)}>
          {compact(
            routes.toArray().map(({ slug, component, label }, i) => {
              if (!label) return null
              return (
                <Link
                  className={classnames([
                    styles.item,
                    router.location.pathname === slug
                      ? styles["item--active"]
                      : null,
                    //"hvr-underline-from-center"
                  ])}
                  key={slug}
                  to={slug}
                >
                  <span>{label}</span>
                </Link>
              )
            })
          )}
        </div>
        <SchoolSelectComponent auth={auth} updateIpeds={updateIpeds} />
        <MenuButtonComponent
          selected={this.state.selected}
          onClick={this._onSideMenuClick}
        />
      </div>
    )
  }
}
