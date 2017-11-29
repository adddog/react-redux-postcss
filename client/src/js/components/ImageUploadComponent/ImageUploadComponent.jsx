import React, { Component, PropTypes } from "react"
import classnames from "classnames"

import ModalImageComponent from "components/ModalImageComponent/ModalImageComponent"

export default class ImageUploadComponent extends Component {

  _renderModal() {
    const { modalType } = this.props

    switch (modalType) {
      case MODAL_TYPES.IMAGE: {
        return <ModalImageComponent
        onClick=
         />
      }
      case MODAL_TYPES.VIDEO: {
      }

      default: {
        return null
      }
    }
  }

  render() {
    const { components } = this.props
    return (
      {this._renderModal()}
    )
  }
}
