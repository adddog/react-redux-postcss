import React, { PureComponent, PropTypes } from "react"
import { findDOMNode } from "react-dom"
import { autobind } from "core-decorators"
import { find } from "lodash"
import classnames from "classnames"
import ReactTooltip from "react-tooltip"

import styles from "./InfoTooltipComponent.css"

import BaseTooltipComponent from "./BaseTooltipComponent"
import ActionButtonComponent from "components/UI/ActionButtonComponent"

export default class InfoTooltipComponent extends BaseTooltipComponent {

  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.object.isRequired,
    noIcon: PropTypes.bool,
    onClick: PropTypes.func,
  }

  render() {
    const { data, classes, tooltipClasses, isHidden } = this.props
    return (
      <div
        ref="rootEl"
        data-tip
        className={classnames([
          styles.root,
          ...classes.map(c => styles[c]),
        ])}
      >
        <div
          className={classnames([
            styles.tooltip,
            styles.uCardNoAnim,
            styles.aInstruction,
            ...this.props.classes.map(c => styles[c]),
          ])}
          onClick={this._onClick}
        >
          <label>
            {data.label}
          </label>
          {this._renderIcon()}
        </div>
      </div>
    )
  }
}
