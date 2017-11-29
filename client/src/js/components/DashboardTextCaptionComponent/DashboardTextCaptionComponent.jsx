import React, { Component, PropTypes } from "react"
import classnames from "classnames"

import {
  compose,
  setDisplayName,
  onlyUpdateForPropTypes,
} from "recompose"
import { connect } from "react-redux"
import { find, merge } from "lodash"
import { withRouter } from "react-router-dom"
import { autobind } from "core-decorators"
import { isEmpty } from "lodash"
import { DASHBOARD_PAGE_DASHBOARD_TEXT_CAPTION_COMPONENT } from "utils/styling"
import makeGetSelectedTile from "selectors/dashboard/makeGetSelectedTile"
const shallowEqualObjects = require("shallow-equal/objects")

//import styles from "./DashboardTextCaptionComponent.css"
import InfoTextComponent from "components/UI/InfoTextComponent"
import TextFieldComponent from "components/UI/TextFieldComponent"
import styleObject from "components/UI/TextFieldComponent.sss"
import styles from "./DashboardTextCaptionComponent.css"

import { viewbookMediaUpdate } from "actions/dashboard"

const MAX_CHAR = 140

class DashboardTextCaptionComponent extends Component {
  static propTypes = {
    browser: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    selectedTile: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      caption: "",
      charCount: 0,
      showRequiresPrompt: true,
      showCharCount: false,
    }
  }

  componentDidMount() {
    const { selectedTile } = this.props
    this.setState({
      caption: selectedTile.caption,
    })
  }

  componentWillReceiveProps(nextprops) {
    const { dashboard } = this.props
    const caption = nextprops.selectedTile.caption || ""
    this.setState({
      caption,
      showRequiresPrompt: caption.length < 1,
    })
  }

  shouldComponentUpdate(nextprops, nextstate) {
    return (
      !shallowEqualObjects(nextstate, this.state) ||
      nextprops.browser.width !== this.props.browser.width
    )
  }

  @autobind
  _onTextInfoTimeout() {
    this.setState({
      showCharCount: false,
    })
  }

  @autobind
  _onChange(e, newValue) {
    clearTimeout(this._showTo)
    this._showTo = setTimeout(this._onTextInfoTimeout, 3000)
    this.setState({
      caption: newValue,
      showCharCount: true,
      charCount: newValue.length,
    })
    this.props.viewbookMediaUpdate({ caption: newValue })
  }

  render() {
    const { selectedTile, dashboard, browser } = this.props
    return (
      <div
        ref="rootEl"
        className={classnames([
          styles.root,
          styles.uCardNoAnim,
          styles["aShow--slow"],
          styles["uCard--light"],
          styles.uCardSeperated,
        ])}
      >
        <InfoTextComponent
          className={classnames(styles.wordsRemaining)}
          classes={!this.state.showCharCount ? ["root--hide"] : null}
          text={`${MAX_CHAR -
            this.state.charCount} characters remaining`}
        />
        <TextFieldComponent
          className={[styles["root"]]}
          style={merge(styleObject[".caption"])}
          onChange={this._onChange}
          floatingLabelStyle={styleObject[".floatingLabelStyle"]}
          underlineStyle={styleObject[".underlineStyle"]}
          hintText={
            isEmpty(selectedTile) ? "Write a caption here" : ""
          }
          defaultValue={selectedTile.caption}
          requiresPrompt={this.state.showRequiresPrompt}
          value={this.state.caption}
          inputStyle={styleObject[".inputStyle"]}
          textareaStyle={styleObject[".textareaStyle"]}
          multiLine={true}
          rows={browser.lessThan.tablet ? 2 : 1}
        />
      </div>
    )
  }
}

const mapStateToProps = () => {
  const getSelectedTile = makeGetSelectedTile()
  return (state, ownProps) => {
    return {
      ...ownProps,
      browser: state.browser,
      dashboard: state.dashboard,
      selectedTile: getSelectedTile(state),
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  viewbookMediaUpdate: data => dispatch(viewbookMediaUpdate(data)),
})

export default compose(
  setDisplayName(DASHBOARD_PAGE_DASHBOARD_TEXT_CAPTION_COMPONENT),
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForPropTypes
)(DashboardTextCaptionComponent)
