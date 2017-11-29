import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import { isEmpty } from "lodash"
import { autobind } from "core-decorators"

import InfoTooltipComponent from "components/UI/InfoTooltipComponent"
import ActionButtonComponent from "components/UI/ActionButtonComponent"
import { DASHBOARD_PAGE_DASHBOARD_PUBLISH_COMPONENT } from "utils/styling"
import { MODAL_TYPES } from "components/ModalComponent/ModalComponent"

import styles from "./DashboardPublishComponent.css"

export default class DashboardPublishComponent extends Component {
  static defaultProps = {
    className: [],
    classes: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      tooltipVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this._showTooltipTo)
    this._showTooltipTo = setTimeout(
      this._changeTooltipState,
      15000,
      nextProps
    )
  }

  componentWillUnmount() {
    clearTimeout(this._showTooltipTo)
  }

  @autobind()
  _changeTooltipState(nextProps) {
    const { hasUnpublishedChanges } = nextProps
    this.setState({
      tooltipVisible: !!hasUnpublishedChanges,
    })
  }

  _renderConfirmation() {
    const { hasUnpublishedChanges } = this.props
    if (!hasUnpublishedChanges || !this.state.tooltipVisible)
      return null
    return (
      <InfoTooltipComponent
        data={{ label: "Unpublished changes" }}
        noIcon={true}
        timeout={4000}
        onClick={() =>
          this.setState({
            tooltipVisible: false,
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
    const { tileIndex } = this.props
    return (
      <div ref="rootEl" className={classnames([styles.root])}>
        {this._renderConfirmation()}
        <ActionButtonComponent
          label={"Publish"}
          icon={<i className="material-icons">cloud_upload</i>}
          onClick={() =>
            this.props.viewbookPublishConfirm(
              MODAL_TYPES.CONFIRM_PUBLISH
            )}
        />
      </div>
    )
  }
}
