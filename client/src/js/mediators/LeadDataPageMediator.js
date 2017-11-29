import LeadDataPageContainer from 'containers/LeadDataPageContainer/LeadDataPageContainer';
import makeGetAppContentDimensions from 'selectors/makeGetAppContentDimensions';

import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes
} from 'recompose';
import { connect } from 'react-redux';
import { find, omit } from 'lodash';
import { withRouter } from 'react-router-dom';

import { resize } from 'actions/resize';
import { leadDataRequest, dateSelect } from 'actions/leadData';
import { LEAD_DATA_PAGE_CONTAINER } from 'utils/styling';
import { setComponentDimensions } from 'actions/componentUI';
const mapStateToProps = () => {
  return (state, ownProps) => {
    return {
      browser: state.browser,
      leadData: state.leadData,
      ...ownProps
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  setComponentDimensions: data => dispatch(setComponentDimensions(data)),
  leadDataRequest: data => dispatch(leadDataRequest(data)),
  dateSelect: data => dispatch(dateSelect(data)),
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
  setDisplayName(LEAD_DATA_PAGE_CONTAINER),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  onlyUpdateForPropTypes
)(LeadDataPageContainer);
