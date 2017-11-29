import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import { compose } from "recompose"
import { connect } from "react-redux"
import { merge } from "lodash"
import { autobind, debounce } from "core-decorators"
const shallowEqualObjects = require("shallow-equal/objects")

import makeGetSelectedTile from "selectors/dashboard/makeGetSelectedTile"
import { youtubeRegex } from "selectors/componentUI/makeGetModalConfirmation"

import InfoTooltipComponent from "components/UI/InfoTooltipComponent"
import InfoTextComponent from "components/UI/InfoTextComponent"
import InstructionComponent from "components/UI/InstructionComponent"
import TextFieldComponent from "components/UI/TextFieldComponent"
import SeparatorComponent from "components/UI/SeparatorComponent"
import { DASHBOARD_PAGE_UPLOAD_MEDIA_COMPONENT } from "utils/styling"
import { MODAL_TYPES } from "components/ModalComponent/ModalComponent"
import FileUploadComponent from "components/FileUploadComponent/FileUploadComponent"

import bassObject from "components/UI/TextFieldComponent.sss"
import styleObject from "./UploadMediaComponent.sss"
import styles from "./UploadMediaComponent.css"

import {
  viewbookVideoLink,
  viewbookVideoLinkConfirmed,
} from "actions/dashboard"
import {
  openModal,
} from "actions/componentUI"

class UploadMediaComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewbookVideoLink: props.selectedTile.isVideo
        ? props.selectedTile.url
        : "",
      showConfirmInfoCount: 0,
      showConfirmInfo: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTile.url !== this.props.selectedTile.url) {
      this.setState({
        viewbookVideoLink: nextProps.selectedTile.isVideo
          ? nextProps.selectedTile.url
          : "",
      })
      console.log(nextProps.videoLink, this.props.videoLink);
      if (
        !!nextProps.selectedTile.url &&
        !!this.props.selectedTile.url &&
        nextProps.videoLink !== this.props.videoLink
      ) {
        this._allowShowConfimation()
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.viewbookVideoLink !== this.state.viewbookVideoLink ||
      !shallowEqualObjects(
        nextProps.selectedTile,
        this.props.selectedTile
      )
    )
  }

  @debounce(600)
  _allowShowConfimation() {
    this.setState({
      showConfirmInfo: true,
    })
  }

  _renderInfo() {
    if (
      !!youtubeRegex(this.state.viewbookVideoLink) === false ||
      !this.state.showConfirmInfo ||
      this.state.showConfirmInfoCount > 3
    )
      return null
    return (
      <InfoTooltipComponent
        data={{ label: "Press ENTER to confirm" }}
        noIcon={true}
        timeout={4000}
        onClick={() =>
          this.setState({
            showConfirmInfoCount: this.state.showConfirmInfoCount++,
            showConfirmInfo: false,
          })}
        classes={["root--nowrap", "root--noInteract"]}
        tooltipClasses={[
          "tooltip",
          "tooltip--left",
          "tooltip--bottom",
        ]}
      />
    )
  }

  render() {
    const { auth, dashboard } = this.props
    return (
      <div ref="rootEl" className={classnames([styles.root])}>
        <div className={classnames([styles.row])}>
          <div
            className={classnames([
              styles["row__item"],
              styles["uCardNoAnim"],
              styles["aShow--slow"],
              styles["uCard--light"],
              styles["uCard--padding--sm"],
              styles["uCardSeperated"],
            ])}
          >
            <FileUploadComponent
              label="Choose photos"
              iconName="image"
              onClick={() => this.props.openModal(MODAL_TYPES.IMAGE)}
            />
          </div>

          <div
            className={classnames([
              styles["row__item"],
              styles["uCardNoAnim"],
              styles["uCard--light"],
              styles["uCard--padding--sm"],
              styles["uCardSeperated"],
            ])}
          >
            <div
              className={classnames([styles["row__item--wrapper"]])}
            >
              <InfoTextComponent
                className={classnames([
                  styles["linkValidationText"],
                  !!youtubeRegex(this.state.viewbookVideoLink) ===
                    false && this.state.viewbookVideoLink.length > 0
                    ? styles["linkValidationText--error"]
                    : null,
                ])}
                text={`Invalid youtube link`}
              />
              <TextFieldComponent
                defaultValue={this.state.viewbookVideoLink}
                value={this.state.viewbookVideoLink}
                iconClass="fa fa-youtube"
                className={[styles.caption]}
                onChange={(e, val) => {
                  this.setState({
                    viewbookVideoLink: val,
                  })
                  this.props.viewbookVideoLink(val)
                }}
                onKeyPress={e => {
                  if (e.charCode === 13) {
                    //has exisiting url
                    if (this.state.viewbookVideoLink) {
                      this.props.viewbookVideoLink(
                        this.state.viewbookVideoLink
                      )
                      this.props.openModal(MODAL_TYPES.VIDEO)
                    } else {
                      this.props.viewbookVideoLinkConfirmed()
                    }
                  }
                }}
                style={merge(
                  bassObject[".caption"],
                  styleObject[".caption"]
                )}
                floatingLabelStyle={bassObject[".floatingLabelStyle"]}
                floatingLabelFocusStyle={
                  bassObject[".floatingLabelFocusStyle"]
                }
                inputStyle={bassObject[".inputStyle"]}
                underlineFocusStyle={
                  bassObject[".underlineFocusStyle"]
                }
                textareaStyle={bassObject[".textareaStyle"]}
                hintText="Paste youtube link"
                multiLine={false}
                rows={1}
              />
              {this._renderInfo()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = () => {
  const getSelectedTile = makeGetSelectedTile()
  return (state, ownProps) => {
    return {
      ...ownProps,
      videoLink: state.dashboard.get('viewbookVideoLink'),
      selectedTile: getSelectedTile(state),
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  viewbookVideoLink: url => dispatch(viewbookVideoLink(url)),
  viewbookVideoLinkConfirmed: () =>
    dispatch(viewbookVideoLinkConfirmed()),
  openModal: componentName => dispatch(openModal(componentName)),
})

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  UploadMediaComponent
)
