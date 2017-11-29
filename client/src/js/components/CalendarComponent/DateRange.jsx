/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import momentPropTypes from 'react-moment-proptypes';
import { forbidExtraProps } from 'airbnb-prop-types';
import moment from 'moment';
import { isNil, isEmpty, omit } from 'lodash';
import {constants} from 'react-dates'
import merge from 'lodash/merge';

import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController,
  isInclusivelyAfterDay
} from 'react-dates';

import styles from './DateRange.css';

const START_DATE = 'startDate';
const END_DATE = 'endDate';

const defaultProps = {
  // example props for the demo
  autoFocusEndDate: true,
  initialStartDate: null,
  initialEndDate: null,

  // day presentation and interaction related props
  renderDay: null,
  minimumNights: 1,
  isDayBlocked: () => false,
  // isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  isDayHighlighted: () => false,
  enableOutsideDays: true,

  // calendar presentation and interaction related props
  withPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 6,
  // keepOpenOnDateSelect: false,
  renderCalendarInfo: null,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},

  // internationalization
  monthFormat: 'MMMM YYYY'
};

class DayPickerRangeControllerWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: props.autoFocusEndDate ? END_DATE : START_DATE,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
      dateSelected: props.dateSelected
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
    this.props.onDatesChange(startDate, endDate);
  }

  onFocusChange(focusedInput) {
    this.setState({
      // Force the focusedInput to always be truthy so that dates are always selectable
      focusedInput: !focusedInput ? START_DATE : focusedInput
    });
  }

  componentDidMount() {
    if (!this.refs.rootEl) return;
    const header = this.refs.rootEl.querySelector('.DayPicker__week-headers');
    const headers = header.querySelectorAll('.DayPicker__week-header');
    console.log('headers.length', headers.length, 'this.props.numberOfMonths', this.props.numberOfMonths);
    if (headers.length <= this.props.numberOfMonths) {
      for (let i = 0; i < this.props.numberOfMonths + 1 - headers.length; i++) {
        const dupNode = headers[0].cloneNode(true);
        header.appendChild(dupNode);
      }
    }
    this._mainEl = this.refs.rootEl.querySelector('.DayPicker');
    this._resize(this.props);
  }

  _resize(props) {
    this._mainEl.style.width = `${(props.numberOfMonths + 1) * 200}px`;
  }

  componentWillReceiveProps(nextprops) {
    this._resize(nextprops);
  }

  render() {
    const { showInputs, dateRanges, leadCalendarDates, dateSelected } = this.props;
    let { focusedInput, startDate, endDate } = this.state;
    if (isNil(startDate) && isNil(endDate) && !isNil(dateRanges)) {
      startDate = dateSelected.start;
      endDate = dateSelected.end;
    }
    const props = omit(this.props, [
      'leadCalendarDates',
      'dateRanges',
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate'
    ]);
    return (
      <div
        className={classnames([
          styles.root,
          styles.uCardNoAnim,
          styles['uCard--light'],
          styles.uCardSeperated
        ])}
        ref="rootEl"
      >
        <DayPickerRangeController
          {...props}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    );
  }
}

DayPickerRangeControllerWrapper.defaultProps = defaultProps;

export default DayPickerRangeControllerWrapper;
