import React, { Component, PropTypes } from "react"
import { CSSTransitionGroup } from "react-transition-group"

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
import { isNil } from "lodash"

import makeGetModalConfirmation from "selectors/componentUI/makeGetModalConfirmation"
import makeGetSelectedTile from "selectors/dashboard/makeGetSelectedTile"

import ModalImageComponent from "components/ModalImageComponent/ModalImageComponent"
import ModalConfirmComponent from "components/ModalConfirmComponent/ModalConfirmComponent"

import styles from "./ModalComponent.css"

import {
  viewbookImageChosen,
  viewbookMediaDelete,
  viewbookImageUpload,
  viewbookImageLink,
  viewbookImageLinkConfirm,
  viewbookVideoLinkConfirmed,
  viewbookPublish,
} from "actions/dashboard"
import { openModal, closeModal } from "actions/componentUI"

export const MODAL_TYPES = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  IMAGE_CONFIRM_UPLOAD: "IMAGE_CONFIRM_UPLOAD",
  IMAGE_CONFIRM_LINK: "IMAGE_CONFIRM_LINK",
  CONFIRM_SELECT_DELETE: "CONFIRM_SELECT_DELETE",
  CONFIRM_PUBLISH: "CONFIRM_PUBLISH",
}

class ModalComponent extends Component {
  static propTypes = {
    modalConfirmation: PropTypes.object,
    selectedTile: PropTypes.object,
    components: PropTypes.object.isRequired,
  }

  /*componentWillReceiveProps(nextProps) {
    const { components, modalConfirmation } = nextProps
    const modalType = components.get("modalType")
    if (
      (modalType === MODAL_TYPES.IMAGE_CONFIRM_UPLOAD ||
        modalType === MODAL_TYPES.IMAGE_CONFIRM_LINK) &&
      isNil(modalConfirmation)
    ) {
      switch (modalType) {
        case MODAL_TYPES.IMAGE_CONFIRM_LINK:
        case MODAL_TYPES.IMAGE_CONFIRM_UPLOAD:
          //this.props.openModal(MODAL_TYPES.IMAGE)
          break
      }

      //nextProps.viewbookImageUpload()
      //nextProps.closeModal()
    }
  }*/
  /*
  componentWillReceiveProps(nextProps){
    if(this._canRenderRoot(nextProps)){
      this.props.closeModal()
    }
  }*/

  _renderModalConfirm(props) {
    if (!props.modalConfirmation) return null
    return <ModalConfirmComponent {...props} />
  }

  _renderImage() {
    const { selectedTile } = this.props
    return (
      <ModalImageComponent
        onImageSelected={file => {
          if (!selectedTile.hasMedia) {
            this.props.viewbookImageUpload(file)
            this.props.closeModal()
          } else {
            this.props.viewbookImageChosen(file)
            this.props.openModal(MODAL_TYPES.IMAGE_CONFIRM_UPLOAD)
          }
        }}
        viewbookImageLink={this.props.viewbookImageLink}
        viewbookImageLinkSelectd={() => {
          if (!selectedTile.hasMedia) {
            this.props.viewbookImageLinkConfirm()
            this.props.closeModal()
          } else {
            this.props.openModal(MODAL_TYPES.IMAGE_CONFIRM_LINK)
          }
        }}
        closeModal={this.props.closeModal}
      />
    )
  }

  _renderModal() {
    const { components, dashboard, modalConfirmation } = this.props
    const modalType = components.get("modalType")
    switch (modalType) {
      case MODAL_TYPES.IMAGE: {
        return this._renderImage()
      }
      case MODAL_TYPES.VIDEO: {
        return this._renderModalConfirm({
          modalConfirmation: modalConfirmation,
          onYes: () => {
            this.props.viewbookVideoLinkConfirmed()
            this.props.closeModal()
          },
          onNo: () => this.props.closeModal(),
        })
      }

      case MODAL_TYPES.IMAGE_CONFIRM_LINK:
      case MODAL_TYPES.IMAGE_CONFIRM_UPLOAD: {
        return this._renderModalConfirm({
          modalConfirmation: modalConfirmation,
          onYes: () => {
            switch (modalType) {
              case MODAL_TYPES.IMAGE_CONFIRM_LINK:
                if (modalConfirmation.valid) {
                  this.props.viewbookImageLinkConfirm()
                }
                break
              case MODAL_TYPES.IMAGE_CONFIRM_UPLOAD:
                this.props.viewbookImageUpload()
                break
            }
            this.props.closeModal()
          },
          onNo: () => this.props.openModal(MODAL_TYPES.IMAGE),
        })
      }
      case MODAL_TYPES.CONFIRM_SELECT_DELETE: {
        return this._renderModalConfirm({
          modalConfirmation: modalConfirmation,
          onYes: () => {
            this.props.viewbookMediaDelete()
            this.props.closeModal()
          },
          onNo: () => this.props.closeModal(),
        })
      }
      case MODAL_TYPES.CONFIRM_PUBLISH: {
        return this._renderModalConfirm({
          modalConfirmation: modalConfirmation,
          onYes: () => {
            this.props.viewbookPublish()
            this.props.closeModal()
          },
          onNo: () => this.props.closeModal(),
        })
      }
      default: {
        return null
      }
    }
  }

  _canRenderRoot(props) {
    const { components, dashboard } = props || this.props
    if (!components.get("isModalVisible")) return false
    const modalType = components.get("modalType")
    if (modalType === MODAL_TYPES.VIDEO) {
      if (dashboard.get("hasViewbookVideoError")) return false
    }
    return true
  }

  render() {
    if (!this._canRenderRoot()) return null
    return (
      <CSSTransitionGroup
        className={classnames([styles.root])}
        transitionAppear={true}
        transitionEnter={true}
        transitionLeave={true}
        transitionName={{
          enter: styles.modalEnter,
          enterActive: styles.modalEnterActive,
          appear: styles.modalAppear,
          appearActive: styles.modalAppearActive,
          leave: styles.modalLeave,
          leaveActive: styles.modalLeaveActive,
        }}
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
        transitionAppearTimeout={150}
      >
        <div
          className={classnames([styles["root__bg"]])}
          onClick={this.props.closeModal}
        />
        <div
          className={classnames([
            styles["root__anim__content"],
            styles.uCardNoAnim,
            styles["uCard--light"],
          ])}
        >
          <div className={classnames([styles["root__content"]])}>
            {this._renderModal()}
          </div>
        </div>
      </CSSTransitionGroup>
    )
  }
}

const mapStateToProps = () => {
  const getModalConfirmation = makeGetModalConfirmation()
  const getSelectedTile = makeGetSelectedTile()
  return (state, ownProps) => {
    return {
      ...ownProps,
      selectedTile: getSelectedTile(state),
      modalConfirmation: getModalConfirmation(state),
      dashboard: state.dashboard,
      components: state.components,
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  closeModal: () => dispatch(closeModal()),
  openModal: modalType => dispatch(openModal(modalType)),
  actionSelected: () => dispatch(actionSelected()),
  viewbookVideoLinkConfirmed: () =>
    dispatch(viewbookVideoLinkConfirmed()),
  viewbookMediaDelete: () => dispatch(viewbookMediaDelete()),
  viewbookImageChosen: files => dispatch(viewbookImageChosen(files)),
  viewbookImageUpload: files => dispatch(viewbookImageUpload(files)),
  viewbookImageLink: link => dispatch(viewbookImageLink(link)),
  viewbookImageLinkConfirm: () =>
    dispatch(viewbookImageLinkConfirm()),
  viewbookPublish: () => dispatch(viewbookPublish()),
})

export default compose(
  setDisplayName("ModalComponent"),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForPropTypes
)(ModalComponent)
