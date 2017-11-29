import { createSelector } from 'reselect'
import { REQUIRED_LEAD_DATA_KEYS } from 'reducers/leadData'
import { first, slice, keys, xor, pick, omit, isNil } from 'lodash'

const getTableFilterHeaders = state => state.leadData.get('tableFilterHeaders') || []

export const getDateSelectedLeadData = state => {
  /*
        1. Filter data using the date
    */
  let values
  const dateSelected = state.leadData.get('dateSelected')
  const yearStart = state.leadData.get('yearStartUnix')
  const yearEnd = state.leadData.get('yearEndUnix')

  if (!dateSelected) {
    return null
  }

  if (
    dateSelected.start.startOf('day').unix() >= yearStart &&
    dateSelected.end.endOf('day').unix() <= yearEnd
  ) {
    values = state.leadData.get('yearRangeValues')
  } else {
    values = state.leadData.get('leadDataValues')
  }
  if (!values) return null

  /*
  let ignore = compareData(state);
  if (ignore) {
    return null;
  }
  */

  if (!state.leadData.get('tableFilterCSVExportSettings').useCalendarForExport) {
    return values
  }

  return values.filter(obj => {
    return (
      obj.dateUnix >= dateSelected.start.startOf('day').unix() &&
      obj.dateUnix <= dateSelected.end.endOf('day').unix()
    )
  })
}

const compareData = state => {
  let dateSelected = state.leadData.get('dateSelected')
  let lastApiSelected = state.leadData.get('lastLeadApiDateSelected')
  let isLoadingLeads = state.leadData.get('isLoadingLeads')
  console.log('isLoadingLeads', isLoadingLeads)
  if (isNil(lastApiSelected)) {
    return false
  }
  console.log(
    'fistDate::',
    lastApiSelected.start.startOf('day').unix(),
    'dateSelected::first',
    dateSelected.start.startOf('day').unix()
  )
  console.log(
    'lastDate::',
    lastApiSelected.end.endOf('day').unix(),
    'dateSelected::last',
    dateSelected.end.endOf('day').unix()
  )
  let selectedStart = dateSelected.start.startOf('day').unix()
  let selectedEnd = dateSelected.end.endOf('day').unix()
  let lastSelectedStart = lastApiSelected.start.startOf('day').unix()
  let lastSelectedEnd = lastApiSelected.end.endOf('day').unix()
  if (selectedStart === lastSelectedStart && selectedEnd === lastSelectedEnd) {
    return true
  } else {
    return false
  }
}

export const makeGetDateSelectedLeadData = () =>
  createSelector(
    [state => getDateSelectedLeadData(state), getTableFilterHeaders],
    (dataSelected, tableFilterHeaders) => {
      return dataSelected
    }
  )

export default makeGetDateSelectedLeadData
