import DashboardPageContainer from 'containers/DashboardPageContainer/DashboardPageContainer';
import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes
} from 'recompose';
import { connect } from 'react-redux';
import { find, omit } from 'lodash';
import { withRouter } from 'react-router-dom';
import { DASHBOARD_PAGE_CONTAINER } from 'utils/styling';

import { dashboardDataRequest, viewbookPublish } from 'actions/dashboard';
import { openModal } from 'actions/componentUI';
import { resize } from 'actions/resize';
import { premiumPartnerApiRequest } from 'actions/common';

const mapStateToProps = () => {
  return (state, ownProps) => {
    return {
      auth: state.auth,
      components: state.components,
      browser: state.browser,
      dashboard: state.dashboard,
      router: state.router,
      ...ownProps
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  premiumPartnerApiRequest: () => dispatch(premiumPartnerApiRequest()),
  dashboardDataRequest: data => dispatch(dashboardDataRequest(data)),
  openModal: componentName => dispatch(openModal(componentName)),
  resize: data => dispatch(resize())
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  };
};

export default compose(
  setDisplayName(DASHBOARD_PAGE_CONTAINER),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  onlyUpdateForPropTypes
)(DashboardPageContainer);
