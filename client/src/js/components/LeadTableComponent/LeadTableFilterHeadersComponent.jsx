import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import { compose, onlyUpdateForPropTypes } from 'recompose';
import { connect } from 'react-redux';
import { compact, map } from 'lodash';
import S from 'string';
import { autobind } from 'core-decorators';
import Select from 'react-select';
import makeGetTableSelectedColumns from 'selectors/leadData/makeGetTableSelectedColumns';
import makeGetDateSelectedLeadData from 'selectors/leadData/makeGetDateSelectedLeadData';

import InfoTextComponent from 'components/UI/InfoTextComponent';
import InstructionComponent from 'components/UI/InstructionComponent';

import styles from './LeadTableFilterHeadersComponent.css';

import { tableFilterHeaders } from 'actions/leadData';
import { saveSettingsPost } from 'actions/common';

class LeadTableFilterHeadersComponent extends Component {
  static propTypes = {
    tableSelectedColumns: PropTypes.object.isRequired,
    leadData: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  @autobind
  _onFilterChanged(value) {
    this.props.tableFilterHeaders(value);
    this.props.saveSettingsPost();
  }

  _renderError() {
    const { tableSelectedColumns } = this.props;
    const show =
      tableSelectedColumns.visibleTableColumnsKeys.length ===
      tableSelectedColumns.maxColumns;
    return (
      <CSSTransitionGroup
        transitionAppear={true}
        transitionEnter={true}
        transitionLeave={true}
        transitionName={{
          enter: styles.fadeEnter,
          enterActive: styles.fadeEnterActive,
          appear: styles.fadeAppear,
          appearActive: styles.fadeAppearActive,
          leave: styles.fadeLeave,
          leaveActive: styles.fadeLeaveActive
        }}
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
        transitionAppearTimeout={150}
      >
        {show
          ? <InfoTextComponent
              className={classnames([
                styles['warning'],
                styles['warning--error']
              ])}
              text={this.props.copy.amountOfAppliedFiltersWarning}
            />
          : null}
      </CSSTransitionGroup>
    );
  }

  render() {
    const { tableSelectedColumns, leadData } = this.props;

    const options = tableSelectedColumns.hiddenColumns || [];

    if (!options.length) return null;

    return (
      <div className={styles.root}>
        {this._renderError()}
        <Select
          name="form-field-name"
          multi={true}
          placeholder={'Select table columns...'}
          value={tableSelectedColumns.selectedTableColumnsKeys}
          options={leadData.get('tableFilterHeadersOriginal')}
          onChange={this._onFilterChanged}
        />
      </div>
    );
  }
}

const mapStateToProps = () => {
  const getTableSelectedColumns = makeGetTableSelectedColumns();
  const getDateSelectedLeadData = makeGetDateSelectedLeadData();
  return (state, ownProps) => {
    return {
      ...ownProps,
      copy: state.copy.get('copy').LeadTableFilterHeadersComponent,
      leadData: state.leadData,
      tableSelectedColumns: getTableSelectedColumns(state)
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  tableFilterHeaders: data => dispatch(tableFilterHeaders(data)),
  saveSettingsPost: () => dispatch(saveSettingsPost())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForPropTypes
)(LeadTableFilterHeadersComponent);
