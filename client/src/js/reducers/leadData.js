import {
  SETTINGS_SET,
  PREMIUM_PARTNER_SUCCESS,
  LEAD_DATA_SUCCESS,
  LEAD_DATA_DATE_SELECT,
  LEAD_DATA_TABLE_FILTER_HEADERS,
  LEAD_DATA_TABLE_SET_FILTERED_DATA,
  LEAD_DATA_TABLE_FILTER_SETTINGS,
  LEAD_DATA_FILTER_WARN,
  IS_LOADING_LEADS,
  IS_DONE_LOADING_LEADS,
  SET_YEAR_RANGE,
  SET_YEAR_RANGE_VALUES,
  LEAD_HEADERS_SET
} from 'actions/actionTypes'

import moment from 'moment'
import S from 'string'
import {
  forIn,
  find,
  values,
  keys,
  map,
  first,
  pick,
  xor,
  last,
  isObject,
  isEmpty,
  isNil,
  isNull,
  isArray
} from 'lodash'

import { Map } from 'immutable'

import { getMaxColumns } from 'selectors/leadData/makeGetTableSelectedColumns'
import { SET_YEARLY_LEAD_DATA } from '../actions/actionTypes'

const initialState = new Map()
  //STATIC
  .set('calendarControlMenu', [
    {
      label: 'Select all'
    }
  ])
  .set('yearStart', undefined)
  .set('yearEnd', undefined)
  //set from settings.json
  .set('isLoadingLeads', false)
  .set('tableFilterSettings', undefined)
  .set('leadDataValues', undefined)
  //the original keys from the data, no REQUIRED_LEAD_DATA_KEYS
  .set('tableFilterHeadersOriginal', undefined)
  .set('leadDataHeaderKeys', undefined)
  .set('leadCalendarDates', undefined)
  //DYNAMIC
  .set('filteredData', [])
  .set('filterWarning', undefined)
  //start and end
  .set('dateRanges', undefined)
  .set('dateSelected', undefined)
  //controlled by LeadTableFilterComponent.jsx
  .set('tableFilterHeaders', [])
  //always true by default. Removed in commit : 7191c50
  .set('tableFilterSettings', {
    useCalendarForExport: true,
    useTableFilterForExport: true,
    useColummnsForExport: true
  })
  //override in SETTINGS_SET
  .set('tableFilterCSVExportSettings', {
    useCalendarForExport: true,
    useTableFilterForExport: true,
    useColummnsForExport: true
  })

const parseLeadMapData = object => {
  return values(object).map(d =>
    Object.assign(d, {
      dateUnix: moment(d.first_pinned_date)
        .startOf('day')
        .add(1000)
        .unix(),
      dateFormated: moment(d.first_pinned_date)
        .startOf('day')
        .add(1000)
        .format('YYYY-MM-DD')
    })
  )
}

const parseTableFilterHeaders = (state, data) => {
  //TODO: Figure out why this doesn't actually remove dupes.
  /*
    Remove dublicates from array : Sets can't  have dupes
  */
  if (state.get('tableFilterHeaders').length === 0) {
    return [
      ...new Set([...state.get('tableFilterHeaders').map(d => d.value), ...data])
    ].map(key => ({
      value: key,
      label: S(key)
        .capitalize()
        .humanize().s
    }))
  } else {
    return state.get('tableFilterHeaders')
  }
}

export default function leadData(state = initialState, action) {
  switch (action.type) {
    /*
    Initial load headers defined in settings.json,
    leadDataSaga
    */
    case SET_YEAR_RANGE_VALUES: {
      const { response, start, end } = action
      let leadData = []
      if (isArray(response) && !isNil(response)) {
        leadData = parseLeadMapData(response)
      } else {
        if (!isNil(response.data)) {
          leadData = parseLeadMapData(response.data)
        }
      }
      return state.set('yearRangeValues', leadData).set('yearlyResponse', response)
    }

    case SET_YEARLY_LEAD_DATA: {
      console.log('action', action)
      const { response } = action
      console.log('attached response', response)
      return state.set('yearlyResponse', response)
    }

    case SET_YEAR_RANGE: {
      console.log('action', action)
      const { start, end } = action
      return state
        .set('yearStart', start)
        .set('yearStartUnix', start.startOf('day').unix())
        .set('yearEnd', end)
        .set('yearEndUnix', end.endOf('day').unix())
    }
    case SETTINGS_SET: {
      const { response } = action
      const { leadDataTableFilter = {} } = response
      const { columns, csvExport, onlyDisplayColumnHeaders } = leadDataTableFilter

      console.log('columns:', columns)

      const tableFilterHeaders = []
      forIn(columns, (value, key) => {
        tableFilterHeaders.push({
          value: key,
          label: value
        })
      })

      //Write settings to local storage.
      //Also write settings mods to local storage.

      return (
        state
          //keep a clean to reference
          .set('tableFilterHeadersOriginal', tableFilterHeaders)
          //will be ordering this
          // .set('tableFilterHeaders', tableFilterHeaders)
          .set('tableFilterSettings', leadDataTableFilter)
          .set('tableFilterCSVExportSettings', csvExport)
      )
    }
    /*
    Parse the settings coming from leadDataSaga
    */
    case PREMIUM_PARTNER_SUCCESS: {
      const { response } = action
      // if (!response.dashboard_settings) return state;
      let leadDataFilteredHeaders
      if (
        !isNull(response.dashboard_settings) &&
        !isNil(response.dashboard_settings) &&
        !isEmpty(response.dashboard_settings)
      ) {
        leadDataFilteredHeaders = isObject(response.dashboard_settings)
          ? response.dashboard_settings
          : JSON.parse(response.dashboard_settings)
        console.debug('leadDataFilteredHeaders::', leadDataFilteredHeaders)
      } else {
        leadDataFilteredHeaders = state.get('tableFilterHeadersOriginal')
      }
      return state.set(
        'tableFilterHeaders',
        parseTableFilterHeaders(state, leadDataFilteredHeaders)
      )
    }
    /*
    Lead Data from leadDataSaga
    */
    case LEAD_DATA_SUCCESS: {
      const { response, start, end } = action
      /*
        parse the raw data
        add:
        dateUnix:,
        dateFormaed:,
      */
      let leadData = []
      if (isArray(response) && !isNil(response)) {
        leadData = parseLeadMapData(response)
      } else {
        if (!isNil(response.data)) {
          leadData = parseLeadMapData(response.data)
        }
      }
      if (!leadData.length) return state

      const tableFilterHeaders = state.get('tableFilterHeaders')
      console.log('tableFilterHeaders', tableFilterHeaders)
      let leadDataValues = values(leadData)
      // if (tableFilterHeaders.length) {
      //   const tableFilterKeys = map(tableFilterHeaders, 'value');
      //   leadDataValues = leadDataValues.map(row => pick(row, tableFilterHeaders));
      //   console.log('leadDataValues:', leadDataValues);
      // }
      //order early to recent
      const leadDataSorted = leadDataValues
      return (
        state
          .set('leadDataValues', leadDataValues)
          .set('leadDataHeaderKeys', keys(leadData[0]))
          .set('isLoadingLeads', false)
          .set('leadCalendarDates', leadDataValues.map(v => v.dateFormated))
          // .set('schools', response.)
          .set('dateRanges', {
            start: moment(first(leadDataSorted).first_pinned_date),
            end: moment(last(leadDataSorted).first_pinned_date)
          })
          .set('dateSelected', {
            start: moment(first(leadDataSorted).first_pinned_date),
            startUnix: moment(first(leadDataSorted).first_pinned_date)
              .startOf('day')
              .unix(),
            end: moment(last(leadDataSorted).first_pinned_date),
            endUnix: moment(last(leadDataSorted).first_pinned_date)
              .endOf('day')
              .unix()
          })
          .set('lastLeadApiDateSelected', {
            start: moment(first(leadDataSorted).first_pinned_date),
            startUnix: moment(first(leadDataSorted).first_pinned_date)
              .startOf('day')
              .unix(),
            end: moment(last(leadDataSorted).first_pinned_date),
            endUnix: moment(last(leadDataSorted).first_pinned_date)
              .endOf('day')
              .unix()
          })
      )
    }
    case IS_LOADING_LEADS: {
      return state.set('isLoadingLeads', true)
    }
    case IS_DONE_LOADING_LEADS: {
      return state.set('isLoadingLeads', false)
    }
    case LEAD_DATA_DATE_SELECT: {
      const { payload } = action
      if (!payload.start || !payload.end) return state
      return state.set(
        'dateSelected',
        Object.assign(
          {
            render: false
          },
          state.get('dateSelected'),
          {
            start: payload.start,
            startUnix: payload.start.unix(),
            end: payload.end,
            endUnix: payload.end.unix(),
            render: !!payload.render
          }
        )
      )
    }
    case LEAD_DATA_TABLE_SET_FILTERED_DATA: {
      const { payload } = action
      return state.set('filteredData', payload)
    }
    case LEAD_DATA_TABLE_FILTER_HEADERS: {
      console.log('LEAD_DATA_TABLE_FILTER_HEADERS!!!')
      const { payload } = action
      return state.set('tableFilterHeaders', payload)
    }
    case LEAD_DATA_TABLE_FILTER_SETTINGS: {
      const { payload } = action
      return state.set(
        'tableFilterSettings',
        Object.assign({}, state.get('tableFilterSettings'), payload)
      )
    }
    case LEAD_DATA_FILTER_WARN: {
      const { payload } = action
      return state.set('filterWarning', payload)
    }
    default: {
      return state
    }
  }
}
