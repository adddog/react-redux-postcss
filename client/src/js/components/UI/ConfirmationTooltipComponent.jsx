import React, { PureComponent, Component } from "react"
import { findDOMNode } from "react-dom"
import { autobind } from "core-decorators"
import classnames from "classnames"
import ReactTooltip from "react-tooltip"
import styles from "./ConfirmationTooltipComponent.css"

import ActionButtonComponent from "components/UI/ActionButtonComponent"

export default class ConfirmationTooltipComponent extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    ReactTooltip.show(findDOMNode(this.refs.tooltip))
    setTimeout(() => {
      window.addEventListener("click", this._onClick, false)
    }, 100)
  }

  componentWillUnmount() {
    window.removeEventListener("click", this._onClick)
  }

  @autobind
  _onClick() {
    this.props.onNo()
  }

  _renderIcon(iconClass) {
    return (
      <span className={styles.iconWrapper}>
        <span className={classnames([styles.icon, iconClass])} />
      </span>
    )
  }

  render() {
    return (
      <div
        ref="tooltip"
        data-tip
        className={classnames([styles.root])}
      >
        <ReactTooltip
          place="top"
          effect="solid"
          class={classnames([styles.tooltip, styles.uCardNoAnim])}
        >
          <ActionButtonComponent
            iconClass={classnames(["fa fa-check"])}
            classes={[
              "root--nopadding",
              "root--yes",
              "root--nobackground",
            ]}
            small={true}
            type={"positive"}
            onClick={this.props.onYes}
          />
          <ActionButtonComponent
            iconClass={classnames(["fa fa-times",styles['iconTimes']])}
            classes={[
              "root--nopadding",
              "root--no",
              "root--nobackground",
            ]}
            small={true}
            type={"error"}
            onClick={this.props.onNo}
          />
        </ReactTooltip>
      </div>
    )
  }
}
