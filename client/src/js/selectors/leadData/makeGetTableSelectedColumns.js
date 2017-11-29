import { createSelector } from 'reselect';
import { CONSTANTS } from 'utils/utils';
import { first, slice, pick, map, keys, xor, compact } from 'lodash';
import { getAppContentDimensions } from 'selectors/makeGetAppContentDimensions';
import { getDateSelectedLeadData } from 'selectors/leadData/makeGetDateSelectedLeadData';

export const getMaxColumns = state => {
  const { TABLE_HEADER_WIDTH } = CONSTANTS;
  const appDimensions = getAppContentDimensions(state);
  return Math.floor(appDimensions.width / TABLE_HEADER_WIDTH);
};

/*
    Before any filtering show tableFilterHeadersOriginal
    Then use the filters.
*/
export const getTableFilterHeaders = state =>
  state.leadData.get('tableFilterHeaders').length
    ? state.leadData.get('tableFilterHeaders')
    : slice(
        state.leadData.get('tableFilterHeadersOriginal'),
        0,
        getMaxColumns(state)
      );

export const getTableSelectedColumns = state => {
  const appDimensions = getAppContentDimensions(state);
  const leadData = getDateSelectedLeadData(state);
  const tableFilterHeaders = getTableFilterHeaders(state);
  const maxColumns = getMaxColumns(state);
  const filteredColumnKeys = map(tableFilterHeaders, 'value');
  //only show the data raw header if allowed in settings
  const tableFilterSettings = state.leadData.get('tableFilterSettings');
  const { onlyDisplayColumnHeaders, allowColumnWrapping } = tableFilterSettings;
  const titles = onlyDisplayColumnHeaders
    ? []
    : state.leadData.get('leadDataHeaderKeys') || [];

  //remove dupes
  const deDupedfilteredColumnKeys = [
    ...new Set([...filteredColumnKeys, ...titles])
  ];

  const spliceIndex =
    deDupedfilteredColumnKeys.length > maxColumns && allowColumnWrapping
      ? deDupedfilteredColumnKeys.length - maxColumns
      : 0;

  const visibleTableColumnsKeys = slice(
    deDupedfilteredColumnKeys,
    spliceIndex,
    spliceIndex + maxColumns
  );

  return {
    maxColumns,
    tableFilterHeaders,
    filteredColumnKeys,
    //fill the blue key filter and the export
    selectedTableColumnsKeys: deDupedfilteredColumnKeys,
    selectedColumns: deDupedfilteredColumnKeys.map(
      key => tableFilterHeaders[filteredColumnKeys.indexOf(key)]
    ),
    //visible on the table
    visibleTableColumnsKeys,
    visibleColumns: visibleTableColumnsKeys.map(
      key => tableFilterHeaders[filteredColumnKeys.indexOf(key)]
    ),

    hiddenColumns: xor(
      visibleTableColumnsKeys,
      map(state.leadData.get('tableFilterHeadersOriginal'), 'value')
    ).map(key => tableFilterHeaders[filteredColumnKeys.indexOf(key)])
  };
};

export const makeGetTableSelectedColumns = () =>
  createSelector([getTableSelectedColumns], columns => {
    return columns;
  });

export default makeGetTableSelectedColumns;
