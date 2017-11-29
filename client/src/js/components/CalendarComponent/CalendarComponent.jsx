import React, { PropTypes, PureComponent, Component } from 'react';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import { compose, setDisplayName, withHandlers, onlyUpdateForPropTypes } from 'recompose';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { MOMEMT } from 'utils/utils';
import moment from 'moment';
import { forIn } from 'lodash';

import makeGetComponentStyle from 'selectors/componentUI/makeGetComponentStyle';
import makeGetDateSelectedLeadData from 'selectors/leadData/makeGetDateSelectedLeadData';

import DropdownComponent from 'components/UI/DropdownComponent';

import styles from './CalendarComponent.css';
import styleObject from './CalendarComponent.sss';
import DateRange from './DateRange';

import { dateSelect } from 'actions/leadData';

import { DATE_SELECTOR_COMPONENT } from 'utils/styling';

/*
_react-dates.scss
*/

class CalendarComponent extends Component {
  static propTypes = {
    leadData: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    dateSelectedbrowser: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      dateSelected: {},
      numberOfMonths: this._getNumberOfmonths(props)
    };
  }

  _getNumberOfmonths(props) {
    return Math.floor(props.browser.width / 300);
  }

  componentWillReceiveProps(nextProps) {
    const { leadData, browser } = nextProps;
    this.setState({
      ...this.state,
      numberOfMonths: this._getNumberOfmonths(nextProps),
      dateSelected: leadData.get('dateSelected')
    });
  }

  //only update if new master data
  shouldComponentUpdate(nextProps, nextState) {
    const dateSelected = nextProps.leadData.get('dateSelected');
    if (!dateSelected) return false;
    let update = dateSelected.render || this.state.calendarHeight !== nextState.calendarHeight;
    if (
      nextProps.components.get('isCalendarVisible') !==
        this.props.components.get('isCalendarVisible') ||
      nextProps.browser.width !== this.props.browser.width
    ) {
      update = true;
    }
    return !!update;
  }

  render() {
    const { leadData, components, browser } = this.props;
    const dateSelected = leadData.get('dateSelected');
    const isCalendarVisible = components.get('isCalendarVisible');
    if (!isCalendarVisible) return null;
    return (
      <DateRange
        onDatesChange={(startDate, endDate) => {
          console.log('onDatesChange');
          if (startDate && endDate) {
            this.props.dateSelect({
              start: startDate,
              end: endDate,
              render: true
            });
          }
        }}
        dateSelected={dateSelected}
        leadCalendarDates={leadData.get('leadCalendarDates')}
        dateRanges={leadData.get('dateRanges')}
        numberOfMonths={this.state.numberOfMonths}
        renderCalendarInfo={() => false}
        hideKeyboardShortcutsPanel={true}
        initialStartDate={this.state.dateSelected.start} // momentPropTypes.momentObj or null,
        initialEndDate={this.state.dateSelected.end} // momentPropTypes.momentObj or null,
      />
    );
  }
}

const mapStateToProps = () => {
  const getComponentStyle = makeGetComponentStyle();
  return (state, ownProps) => {
    return {
      ...ownProps,
      components: state.components,
      browser: state.browser,
      leadData: state.leadData
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  dateSelect: data => dispatch(dateSelect(data)),
  downloadCSV: data => dispatch(downloadCSV(data))
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  };
};

export default compose(
  setDisplayName(DATE_SELECTOR_COMPONENT),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  onlyUpdateForPropTypes
)(CalendarComponent);
