import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes
} from 'recompose';
import { connect } from 'react-redux';
import S from 'string';
import { autobind } from 'core-decorators';
import Select from 'react-select';
import makeGetTableSelectedColumns from 'selectors/leadData/makeGetTableSelectedColumns';
import makeGetDateSelectedLeadData from 'selectors/leadData/makeGetDateSelectedLeadData';

import SettingComponent from 'components/UI/SettingComponent';
import ActionButtonComponent from 'components/UI/ActionButtonComponent';
import CalendarIconComponent from 'components/UI/CalendarIconComponent';

import styles from './LeadTableFilterComponent.css';

import {
  tableFilterHeaders,
  updateLeadFilterSettings,
  downloadCSV,
  dateSelect
} from 'actions/leadData';

import { toggleCalendar } from 'actions/componentUI';

class LeadTableFilterComponent extends Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
    leadData: PropTypes.object.isRequired,
    tableSelectedColumns: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      useCalendarForExport: {
        label: 'Export using calendar'
      },
      useColummnsForExport: {
        label: 'Export with column filter'
      },
      useTableFilterForExport: {
        label: 'Export with table filter'
      },
      calendarIcon: {
        label: 'Toggle Calendar'
      }
    };
  }

  @autobind
  _onFilterChanged(value) {
    this.setState({ multiSelectValue: value });
    this.props.tableFilterHeaders(value);
  }

  render() {
    const { tableSelectedColumns, leadData, components } = this.props;

    return (
      <div className={classnames([styles.root])} ref="rootEl">
        <div className={classnames([styles.settings])}>
          <CalendarIconComponent
            isSelected={components.get('isCalendarVisible')}
            onClick={() => this.props.toggleCalendar()}
          />
        </div>
        <div
          className={classnames([styles.settings, styles['settings--right']])}
        >
          <ActionButtonComponent
            label={'Download CSV'}
            icon={<i className="material-icons">system_update_alt</i>}
            onClick={this.props.downloadCSV}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  const getTableSelectedColumns = makeGetTableSelectedColumns();
  return (state, ownProps) => {
    return {
      ...ownProps,
      components: state.components,
      leadData: state.leadData,
      tableSelectedColumns: getTableSelectedColumns(state)
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  tableFilterHeaders: data => dispatch(tableFilterHeaders(data)),
  toggleCalendar: () => dispatch(toggleCalendar()),
  updateLeadFilterSettings: data => dispatch(updateLeadFilterSettings(data)),
  downloadCSV: data => dispatch(downloadCSV(data))
});

export default compose(
  setDisplayName('LeadTableFilterComponent'),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForPropTypes
)(LeadTableFilterComponent);
