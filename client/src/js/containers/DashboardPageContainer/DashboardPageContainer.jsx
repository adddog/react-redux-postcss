import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import Auth from "modules/Auth"
import util from "util"
import { autobind } from "core-decorators"
import { DASHBOARD_PAGE_CONTAINER__COLUMN } from "utils/styling"
import { cover, contain } from "intrinsic-scale"

import DashboardMediaComponent from "components/DashboardMediaComponent/DashboardMediaComponent"
import DashboardTextCaptionComponent from "components/DashboardTextCaptionComponent/DashboardTextCaptionComponent"
import DashboardPublishComponent from "components/DashboardPublishComponent/DashboardPublishComponent"
import UploadMediaComponent from "components/UploadMediaComponent/UploadMediaComponent"
import FileUploadComponent from "components/FileUploadComponent/FileUploadComponent"
import ViewbookComponent from "components/ViewbookComponent/ViewbookComponent"
import ModalComponent from "components/ModalComponent/ModalComponent"

import styles from "./DashboardPageContainer.css"

const SVG_SIZE = { width: 268, height: 554 }
const SVG_ASPECT = SVG_SIZE.width / SVG_SIZE.height

const POSITION = {
  x: 0.072761194,
  y: 0.1353790615,
  width: 0.867424242,
  height: 0.72924187726,
}
export default class DashboardPageContainer extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      phoneElWidth: 50,
    }
  }

  componentDidMount() {
    this.props.resize()
    this.props.premiumPartnerApiRequest()
  }

  componentWillReceiveProps(nextProps) {
    const w = this.refs.rootEl.offsetWidth
    const r = {
      width: w / 2,
      height: this.refs.rootEl.offsetHeight,
    }
    let a = r.width / r.height
    while (a > SVG_ASPECT) {
      r.width -= 1
      a = r.width / r.height
    }
    this.setState({
      phoneElWidth: r.width / w * 100,
    })
  }

  get containerSize() {
    if (!this.refs.phoneEl) return null
    return {
      width: this.refs.phoneEl.offsetWidth,
      height: this.refs.phoneEl.offsetHeight,
    }
  }

  get phoneAspect() {
    const width = this.refs.phoneEl.offsetWidth
    const height = this.refs.phoneEl.offsetHeight
    const a = width / height
    return a < SVG_ASPECT ? a / SVG_ASPECT : SVG_ASPECT / a
  }

  @autobind
  _onFileSelected(files) {
    console.log(files.target.files)
  }

  _renderViewbook() {
    const size = this.containerSize
    if (!size) return null
    const { width, height, x, y } = contain(
      size.width,
      size.height,
      size.height * SVG_ASPECT,
      size.height
    )
    return (
      <ViewbookComponent
        style={{
          left: `${x + width * POSITION.x}px`,
          top: `${y + height * POSITION.y}px`,
          width: `${width * POSITION.width}px`,
          height: `${height * POSITION.height}px`
        }}
      />
    )
  }

  render() {
    const { auth, dashboard } = this.props

    return (
      <section
        data-ui-ref="AppContent"
        ref="rootEl"
        style={{}}
        className={classnames([styles.root, "u-container"])}
      >
        <div
          className={classnames([
            styles.uCardContent,
            styles.content,
          ])}
        >
          <div
            className={classnames([
              styles.column,
              styles["column--media"],
            ])}
          >
            <DashboardMediaComponent />
            <UploadMediaComponent auth={auth} dashboard={dashboard} />
            <DashboardTextCaptionComponent />
            <DashboardPublishComponent
              hasUnpublishedChanges={dashboard.get(
                "viewbookRequiresPublishing"
              )}
              viewbookPublishConfirm={this.props.openModal}
            />
          </div>
          <div
            ref="phoneEl"
            style={{
              width: `${this.state.phoneElWidth}%`,
            }}
            className={classnames([styles.column, styles.phone])}
          >
            {this._renderViewbook()}
          </div>
        </div>
        <ModalComponent />
      </section>
    )
  }
}
