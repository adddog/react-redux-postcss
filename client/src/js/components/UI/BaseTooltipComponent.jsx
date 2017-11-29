import React, { PureComponent, PropTypes } from "react"
import { findDOMNode } from "react-dom"
import { autobind } from "core-decorators"
import { find } from "lodash"
import classnames from "classnames"
import ReactTooltip from "react-tooltip"

const shallowEqualObjects = require("shallow-equal/objects")

import styles from "./BaseTooltipComponent.css"

export default class BaseTooltipComponent extends PureComponent {
  static defaultProps = {
    className: [],
    classes: [],
    tooltipClasses: [],
  }

  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.array.isRequired,
    noIcon: PropTypes.bool,
    onClick: PropTypes.func,
  }

  componentDidMount() {
    this._show()
  }

  /*shouldComponentUpdate(nextProps){
    if(nextProps.data.length){
      const render = !shallowEqualObjects(nextProps.data[0], this.props.data[0])
      console.log(render);
      return render
    }
    return false
  }*/

  componentDidUpdate() {
    this._show()
  }

  _show() {
    this._clean()

    this._mountTO = setTimeout(
      function() {
        if (this.props.onClick) {
          window.addEventListener("click", this._onClick, false)
          window.addEventListener("mousedown", this._onClick, false)
        }
        if (this.refs.rootEl) {
          this.refs.rootEl.classList.add(styles["root--show"])
          this.refs.rootEl.classList.add(styles["aInstruction"])
        }
      }.bind(this),
      300 + (this._delay || 0)
    )

    if (this.props.timeout) {
      this._TO = setTimeout(
        function() {
          this._onClick()
        }.bind(this),
        this.props.timeout + (this._delay || 0)
      )
    }
  }

  componentWillUnmount() {
    this._clean()
  }

  _removeListener() {
    window.removeEventListener("mousedown", this._onClick)
    window.removeEventListener("click", this._onClick)
  }

  _clean() {
    this.refs.rootEl.classList.remove(styles["aInstruction"])
    this.refs.rootEl.classList.remove(styles["root--show"])
    clearTimeout(this._TO)
    clearTimeout(this._mountTO)
    this._removeListener()
  }

  @autobind
  _onClick() {
    this._clean()
    this.props.onClick(this.instruction)
  }

  get instruction() {
    return this._instruction
  }

  set instruction(i) {
    this._instruction = i
  }
  _renderIcon() {
    if (this.props.noIcon) return null
    return (
      <ActionButtonComponent
        iconClass="fa fa-times"
        className={[styles.instructionIcon]}
        classes={["root--nopadding"]}
        small={true}
        type={"basic"}
      />
    )
  }

  render() {}
}
