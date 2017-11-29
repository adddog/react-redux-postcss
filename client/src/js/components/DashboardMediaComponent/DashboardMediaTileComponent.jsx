import React, { PureComponent, PropTypes } from "react"
import classnames from "classnames"
import { autobind } from "core-decorators"
import { debounce } from "lodash-decorators"
import { isEmpty } from "lodash"

import styles from "./DashboardMediaTileComponent.css"

const DRAG_MARGIN = 6

export default class DashboardMediaTileComponent extends PureComponent {
  static defaultProps = {
    className: [],
    classes: [],
  }

  _renderThumbs(i) {
    const { tileData } = this.props
    if (tileData && !isEmpty(tileData)) {
      return <img src={tileData.thumbURL} />
    }
    return null
  }

  componentDidMount() {
    this._pos = {}
    this._isDragSelected = false
    this._calcBounds()
  }

  componentWillReceiveProps(nextProps) {
    const {
      tileMinWidth,
      dragPosition,
      startDragPosition,
    } = nextProps
    this._calcBounds()
    let { top, left, width, height } = this._pos
    if (dragPosition && startDragPosition) {
      const yMin = Math.min(dragPosition.y, startDragPosition.y)
      const xMin = Math.min(dragPosition.x, startDragPosition.x)
      const yMax = Math.max(dragPosition.y, startDragPosition.y)
      const xMax = Math.max(dragPosition.x, startDragPosition.x)
      if (
        top + height / 2 > yMin &&
        top < yMax &&
        left + width / 2 > xMin &&
        left < xMax
      ) {
        this.dragSelect = true
      } else {
        this.dragSelect = false
      }
    }
    if (this.props.isDragging && !nextProps.isDragging) {
      this._dispatchTileDrag({
        index: this.props.tileIndex,
        value: this.dragSelect,
      })
    }
  }

  set dragSelect(v) {
    this._isDragSelected = v
    this.refs.rootEl.classList[v ? "add" : "remove"](
      styles["root__is--dragselected"]
    )
  }

  get dragSelect() {
    return this._isDragSelected
  }

  _dispatchTileDrag(obj) {
    this.props.tileSelectDragChange(obj)
  }

  _calcBounds() {
    this._pos = this.refs.rootEl.getBoundingClientRect()
  }

  @autobind
  _onMouseOver(e) {}

  render() {
    const { tileIndex } = this.props
    return (
      <div
        ref="rootEl"
        style={{
          width: this.props.tileMinWidth,
          minWidth: this.props.tileMinWidth,
        }}
        onClick={() => {
          if (this.props.isDragSelected) {
            this._dispatchTileDrag({
              index: this.props.tileIndex,
              value: false,
            })
          } else {
            this.props.onClick(tileIndex)
          }
        }}
        onMouseOver={() =>
          !this.props.isDisabled
            ? this.props.onMouseOver(tileIndex)
            : false}
        onMouseDown={() =>
          !this.props.isDisabled
            ? this.props.onMouseDown(tileIndex)
            : false}
        onMouseUp={() =>
          !this.props.isDisabled
            ? this.props.onMouseUp(tileIndex)
            : false}
        className={classnames([
          styles.root,
          this.props.isSelected ? styles["root__is--selected"] : null,
          this.props.isGrabbed ? styles["root__is--grabbed"] : null,
          this.props.isDisabled ? styles["root__is--disabled"] : null,
          this.props.isDragSelected ? styles["root__is--dragselected"] : null,
          ...this.props.classes.map(c => styles[c]),
          ...this.props.className,
        ])}
      >
        {this._renderThumbs()}
        {this.props.children}
      </div>
    )
  }
}
