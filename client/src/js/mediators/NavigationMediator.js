import React from 'react';
import {
  compose,
  setDisplayName,
  onlyUpdateForPropTypes,
  withHandlers
} from 'recompose';
import { connect } from 'react-redux';
import { find, omit } from 'lodash';
import { withRouter } from 'react-router-dom';
import makeGetComponentStyle from 'selectors/componentUI/makeGetComponentStyle';
import NavigationContainer from 'containers/NavigationContainer/NavigationContainer';
import { resize } from 'actions/resize';
import { toggleMenu } from 'actions/componentUI';

const DISPLAY_NAME = 'NavigationContainer';

const mapStateToProps = () => {
  const getComponentStyle = makeGetComponentStyle();
  return (state, ownProps) => {
    return {
      router: state.router,
      routes: state.routes,
      customStyling: getComponentStyle(state, DISPLAY_NAME),
      components: state.components,
      ...ownProps
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  resize: data => dispatch(resize()),
  toggleMenu: data => dispatch(toggleMenu())
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  };
};

export default withRouter(
  compose(
    setDisplayName(DISPLAY_NAME),
    withHandlers({}),
    connect(mapStateToProps, mapDispatchToProps, mergeProps),
    onlyUpdateForPropTypes
  )(NavigationContainer)
);
