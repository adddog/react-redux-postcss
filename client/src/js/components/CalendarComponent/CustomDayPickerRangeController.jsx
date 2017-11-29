import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import momentPropTypes from 'react-moment-proptypes';
import { DayPickerRangeController, DayPicker } from 'react-dates';

class CDayPicker extends DayPicker {
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
  }
}

export default class CustomDayPickerRangeController extends DayPickerRangeController {
  static propTypes = {
    startDate: momentPropTypes.momentObj,
    endDate: momentPropTypes.momentObj,
    onDatesChange: PropTypes.func,

    onFocusChange: PropTypes.func,
    onClose: PropTypes.func,

    keepOpenOnDateSelect: PropTypes.bool,
    minimumNights: PropTypes.number,
    isOutsideRange: PropTypes.func,
    isDayBlocked: PropTypes.func,
    isDayHighlighted: PropTypes.func,

    // DayPicker props
    renderMonth: PropTypes.func,
    enableOutsideDays: PropTypes.bool,
    numberOfMonths: PropTypes.number,
    withPortal: PropTypes.bool,
    initialVisibleMonth: PropTypes.func,
    hideKeyboardShortcutsPanel: PropTypes.bool,

    navPrev: PropTypes.node,
    navNext: PropTypes.node,

    onPrevMonthClick: PropTypes.func,
    onNextMonthClick: PropTypes.func,
    onOutsideClick: PropTypes.func,
    renderDay: PropTypes.func,
    renderCalendarInfo: PropTypes.func,

    // accessibility
    onBlur: PropTypes.func,
    isFocused: PropTypes.bool,
    showKeyboardShortcuts: PropTypes.bool,

    // i18n
    monthFormat: PropTypes.string,

    isRTL: PropTypes.bool
  };

  constructor(props) {
    super(omit(props, ['leadCalendarDates']));
    this._leadCalendarDates = props.leadCalendarDates;
    this._leadCalendarDates.forEach(date => {
      //this.addModifier({}, moment(date), "has-data")
    });
  }

  _hasData(day) {
    return this._leadCalendarDates.indexOf(day.format('YYYY-MM-DD')) > -1;
  }

  componentWillReceiveProps(nextProps) {
    /*this.modifiers["blocked-out-of-range"] = day =>
      isOutsideRange(day)*/
    const { isOutsideRange } = nextProps;
    super.componentWillReceiveProps(nextProps);
    let { visibleDays } = this.state;

    // if (isOutsideRange !== this.props.isOutsideRange) {
    //   console.log('-----');
    //   this.modifiers['blocked-out-of-range'] = day => isOutsideRange(day);
    //   console.log(this.modifiers);
    //   console.log('-----');
    //   console.log("We're out of range buddy. Try again!");
    //   //const aa = isOutsideRange(day)
    // }
  }

  componentDidUpdate() {
    // console.log(this.state);
  }

  render() {
    const {
      numberOfMonths,
      orientation,
      monthFormat,
      renderMonth,
      navPrev,
      navNext,
      onOutsideClick,
      withPortal,
      enableOutsideDays,
      firstDayOfWeek,
      hideKeyboardShortcutsPanel,
      daySize,
      focusedInput,
      renderDay,
      renderCalendarInfo,
      onBlur,
      isFocused,
      showKeyboardShortcuts,
      isRTL
    } = this.props;

    const { currentMonth, phrases, visibleDays } = this.state;

    return (
      <CDayPicker
        ref={ref => {
          this.dayPicker = ref;
        }}
        orientation={orientation}
        enableOutsideDays={enableOutsideDays}
        modifiers={visibleDays}
        numberOfMonths={numberOfMonths}
        onDayClick={this.onDayClick}
        onDayMouseEnter={this.onDayMouseEnter}
        onDayMouseLeave={this.onDayMouseLeave}
        onPrevMonthClick={this.onPrevMonthClick}
        onNextMonthClick={this.onNextMonthClick}
        onMultiplyScrollableMonths={this.onMultiplyScrollableMonths}
        monthFormat={monthFormat}
        renderMonth={renderMonth}
        withPortal={withPortal}
        hidden={!focusedInput}
        initialVisibleMonth={() => currentMonth}
        daySize={daySize}
        onOutsideClick={onOutsideClick}
        navPrev={navPrev}
        navNext={navNext}
        renderDay={renderDay}
        renderCalendarInfo={renderCalendarInfo}
        firstDayOfWeek={firstDayOfWeek}
        hideKeyboardShortcutsPanel={hideKeyboardShortcutsPanel}
        isFocused={isFocused}
        getFirstFocusableDay={this.getFirstFocusableDay}
        onBlur={onBlur}
        showKeyboardShortcuts={showKeyboardShortcuts}
        phrases={phrases}
        isRTL={isRTL}
      />
    );
  }
}
