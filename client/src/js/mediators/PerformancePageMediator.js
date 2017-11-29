import PerformancePageContainer from 'containers/PerformancePageContainer/PerformancePageContainer';
import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes
} from 'recompose';
import { connect } from 'react-redux';
import { find, omit } from 'lodash';
import { withRouter } from 'react-router-dom';
import { PERFORMANCE_PAGE_CONTAINER } from 'utils/styling';
import { performanceHeartsRequest } from 'actions/performance';
import { resize } from 'actions/resize';

const mapStateToProps = () => {
  return (state, ownProps) => {
    return {
      performance: state.performance,
      components: state.components,
      browser: state.browser,
      ...ownProps
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  performanceHeartsRequest: () => dispatch(performanceHeartsRequest()),
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
  setDisplayName(PERFORMANCE_PAGE_CONTAINER),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  onlyUpdateForPropTypes
)(PerformancePageContainer);
