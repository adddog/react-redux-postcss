import React, { PureComponent, PropTypes } from "react"
import { findDOMNode } from "react-dom"
import { autobind } from "core-decorators"
import classnames from "classnames"
import renderHTML from "react-render-html"

import styles from "./ModalConfirmComponent.css"

import ModalIconLabelComponent from "components/ModalComponent/ModalIconLabelComponent"

export default class ModalConfirmComponent extends PureComponent {
  static propTypes = {
    modalConfirmation: PropTypes.object,
    onYes: PropTypes.func.isRequired,
    onNo: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className={classnames([styles.root])}>
        <div className={classnames([styles.message])}>
          {renderHTML(this.props.modalConfirmation.html)}
        </div>
        <div className={classnames([styles["root__container"]])}>
          <ModalIconLabelComponent
            className={classnames([
              styles["root__choice"],
              styles["root__choice--yes"],
            ])}
            onClick={this.props.onYes}
            icon="check_circle"
            label="Yes"
          />
          <ModalIconLabelComponent
            className={classnames([
              styles["root__choice"],
              styles["root__choice--no"],
            ])}
            onClick={this.props.onNo}
            icon="not_interested"
            label="No"
          />
        </div>
      </div>
    )
  }
}
