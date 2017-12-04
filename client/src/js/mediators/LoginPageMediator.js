import React from 'react';
import LoginPageContainer from 'containers/LoginPageContainer/LoginPageContainer';
import makeGetLoginErrorMessages from 'selectors/auth/makeGetLoginErrorMessages';

import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes
} from 'recompose';
import { connect } from 'react-redux';
import { find, omit } from 'lodash';
import { withRouter } from 'react-router-dom';

import { login } from 'actions/auth';

const mapStateToProps = () => {
  const getLoginErrorMessages = makeGetLoginErrorMessages();
  return (state, ownProps) => {
    return {
      auth: state.auth,
      loginErrorMessages: getLoginErrorMessages(state),
      ...ownProps
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  login: data => dispatch(login(data))
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
    setDisplayName('LoginPageContainer'),
    withHandlers({}),
    connect(mapStateToProps, mapDispatchToProps, mergeProps),
    onlyUpdateForPropTypes
  )(LoginPageContainer)
);
