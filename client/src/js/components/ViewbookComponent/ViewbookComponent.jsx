import React, { Component, PropTypes } from "react"
import ViewbookComponent from "premium_partner"
import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes
} from "recompose"
import { connect } from "react-redux"

import {
  dashboardViewbookRequest,
  viewbookSelectedMediaIndex
} from "actions/dashboard"

const mapStateToProps = () => {
  return (state, ownProps) => {
    return {
      ...ownProps,
      width: state.browser.width,
      height: state.browser.height,
      assets: state.dashboard.get("viewbook"),
      activeIndex: state.dashboard.get("viewbookSelectedMediaIndex")
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  viewbookSelectedMediaIndex: data =>
    dispatch(viewbookSelectedMediaIndex(data))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onArrowClicked: isLeft => {
      const nextIndex =
        (stateProps.activeIndex + 1) % stateProps.assets.length
      dispatchProps.viewbookSelectedMediaIndex(nextIndex)
    }
  }
}

export default compose(
  setDisplayName("ViewbookComponent"),
  withHandlers({
    onArrowClicked: props => props.onArrowClicked
  }),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  onlyUpdateForPropTypes
)(ViewbookComponent)
