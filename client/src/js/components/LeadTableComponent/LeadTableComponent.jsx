import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import ReactTable from 'react-table';
import S from 'string';
import matchSorter from 'match-sorter';
import {
  compose,
  setDisplayName,
  withHandlers,
  onlyUpdateForPropTypes
} from 'recompose';
import {autobind} from 'core-decorators';
import {connect} from 'react-redux';
import {compact, isNil} from 'lodash';
import {CONSTANTS} from 'utils/utils';
import {LEAD_DATA_PAGE_CONTAINER} from 'utils/styling';
import {getComponentDimensions} from 'selectors/componentUI/getComponentDimensions';
import makeGetAppContentDimensions from 'selectors/makeGetAppContentDimensions';
import makeGetTableSelectedColumns from 'selectors/leadData/makeGetTableSelectedColumns';
import makeGetDateSelectedLeadData from 'selectors/leadData/makeGetDateSelectedLeadData';

import {SpinnerWrapperComponent} from 'components/UI/SpinnerComponent';

import styles from './LeadTableComponent.css';
import styleObject from './LeadTableComponent.sss';

import {setFilteredData} from 'actions/leadData';

class LeadTableComponent extends Component {
  static propTypes = {
    browser: PropTypes.object.isRequired,
    dateSelectedLeadData: PropTypes.array,
    isLoadingLeads: PropTypes.bool,
    appContentDimensions: PropTypes.object,
    tableSelectedColumns: PropTypes.object,
    areaDimensions: PropTypes.object
  };

  @autobind
  _onTableFilterChange(e) {
    this.props.setFilteredData(
      this.refs.leadData.getResolvedState().sortedData
    );
  }

  _renderSpinner(props) {
    return (
      <SpinnerWrapperComponent
        {...props}
        classes={['root--fixed']}
        isVisible={true}
      />
    );
  }

  render() {
    const {
      appContentDimensions,
      tableSelectedColumns,
      dateSelectedLeadData,
      areaDimensions,
      isLoadingLeads
    } = this.props;
    if (!dateSelectedLeadData || isLoadingLeads) return this._renderSpinner();
    if (!tableSelectedColumns.visibleColumns.length) return null;

    const columns = compact(
      tableSelectedColumns.visibleColumns.map(({ value, label }) => {
        // if (!value && !label) return null;
        let header = (!isNil(value.label)) ? value.label : label;
        let access = (!isNil(value.value)) ? value.value : value;
        return {
          Header: header,
          accessor: access,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: [access] }),
          filterAll: true,
          maxWidth:
          areaDimensions.width / tableSelectedColumns.visibleColumns.length
        };
      })
    );

    return (
      <div
        className={classnames([
          styles.root,
          styles.uCardNoAnim,
          styles['uCard--light']
        ])}
      >
        <ReactTable
          ref="leadData"
          data={dateSelectedLeadData}
          onExpandedChange={this._onTableFilterChange}
          onResizedChange={this._onTableFilterChange}
          onPageChange={this._onTableFilterChange}
          onSortedChange={this._onTableFilterChange}
          onPageSizeChange={this._onTableFilterChange}
          onFilteredChange={this._onTableFilterChange}
          filterable={true}
          columns={columns}
        />
      </div>
    );
  }
}

const mapStateToProps = () => {
  const getAppContentDimensions = makeGetAppContentDimensions();
  const getTableSelectedColumns = makeGetTableSelectedColumns();
  const getDateSelectedLeadData = makeGetDateSelectedLeadData();
  return (state, ownProps) => {
    return {
      ...ownProps,
      browser: state.browser,
      areaDimensions: getComponentDimensions(state, LEAD_DATA_PAGE_CONTAINER),
      appContentDimensions: getAppContentDimensions(state),
      dateSelectedLeadData: getDateSelectedLeadData(state),
      tableSelectedColumns: getTableSelectedColumns(state),
      isLoadingLeads: state.leadData.get('isLoadingLeads')
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  setFilteredData: data => dispatch(setFilteredData(data))
});

export default compose(
  setDisplayName('LeadTableComponent'),
  withHandlers({}),
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForPropTypes
)(LeadTableComponent);
