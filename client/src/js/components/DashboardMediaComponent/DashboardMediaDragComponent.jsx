import React, { PureComponent, PropTypes } from "react"
import classnames from "classnames"
import { isEmpty } from "lodash"

import styles from "./DashboardMediaDragComponent.css"

export default class DashboardMediaDragComponent extends PureComponent {
  static defaultProps = {
    className: [],
    classes: [],
    startDragPosition: {
      x: 0,
      y: 0,
    },
  }

  static propTypes = {
    isDragging: PropTypes.bool.isRequired,
    size: PropTypes.object.isRequired,
    startDragPosition: PropTypes.object,
    dragPosition: PropTypes.object,
  }

  componentDidMount() {
    const { size } = this.props
    this.refs.canvasEl.width = size.width
    this.refs.canvasEl.height = size.height
    this._ctx = this.refs.canvasEl.getContext("2d")
  }

  componentWillReceiveProps(nextProps) {
    const { size, isDragging } = nextProps
    if (this.props.size.width !== size.width) {
      this.refs.canvasEl.width = size.width
      this.refs.canvasEl.height = size.height
    }
    this._drawRect(nextProps)
    if(!isDragging){
      this._ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }

  _drawRect(props) {
    if(!props.startDragPosition || !props.dragPosition) return
    this._ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this._ctx.setLineDash([
      4,
      3,
    ]) /*dashes are 5px and spaces are 3px*/
    this._ctx.strokeStyle="#2b2b2b"
    this._ctx.beginPath()
    this._ctx.moveTo(
      props.startDragPosition.x,
      props.startDragPosition.y
    )
    this._ctx.lineTo(props.dragPosition.x, props.startDragPosition.y)
    this._ctx.lineTo(props.dragPosition.x, props.dragPosition.y)
    this._ctx.lineTo(props.startDragPosition.x, props.dragPosition.y)
    this._ctx.lineTo(
      props.startDragPosition.x,
      props.startDragPosition.y
    )
    this._ctx.stroke()
  }

  render() {
    return (
      <canvas ref="canvasEl" className={classnames([styles.root])} />
    )
  }
}
