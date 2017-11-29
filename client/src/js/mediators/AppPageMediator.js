import React from 'react';
import AppPageContainer from "containers/AppPageContainer/AppPageContainer";
import { compose, setDisplayName,onlyUpdateForPropTypes, withHandlers } from "recompose";
import { connect } from "react-redux";
import { find, omit } from "lodash";
import { withRouter } from 'react-router-dom'

import {resize} from "actions/resize";
import {premiumPartnerApiRequest} from "actions/common";

const mapStateToProps = () => {
    return (state, ownProps) => {
        return {
            auth:state.auth,
            router:state.router,
            ...ownProps,
        };
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    resize: (data) => dispatch(resize()),
    premiumPartnerApiRequest: () => dispatch(premiumPartnerApiRequest())
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
    };
};

export default withRouter(compose(
    setDisplayName("AppPageContainer"),
    withHandlers({
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
    ),
    onlyUpdateForPropTypes,
)(AppPageContainer));
