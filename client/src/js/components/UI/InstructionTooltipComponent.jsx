import React, { PureComponent, PropTypes } from "react"
import { findDOMNode } from "react-dom"
import { autobind } from "core-decorators"
import classnames from "classnames"
import ReactTooltip from "react-tooltip"

import styles from "./InstructionTooltipComponent.css"

import BaseTooltipComponent from "./BaseTooltipComponent"
import ActionButtonComponent from "components/UI/ActionButtonComponent"

export default class InstructionTooltipComponent extends BaseTooltipComponent {
  render() {
    const { name, data } = this.props
    if (!data) return null

    const instruction = data[0]
    if (!instruction) return null

    instruction.classes = instruction.classes || []

    this.instruction = instruction
    this._delay = this.instruction.delay

    return (
      <div
        ref="rootEl"
        data-tip
        className={classnames([
          styles.root,
          ...instruction.classes.map(c => styles[c]),
        ])}
      >
        <div
          className={classnames([
            styles.tooltip,
            styles.uCardNoAnim,
            ...this.props.classes.map(c => styles[c]),
          ])}
          onClick={this._onClick}
        >
          <label>
            {this.instruction.label}
          </label>
          <ActionButtonComponent
            iconClass="fa fa-times"
            className={[styles.instructionIcon]}
            classes={["root--nopadding"]}
            small={true}
            type={"basic"}
          />
        </div>
      </div>
    )
  }
}
