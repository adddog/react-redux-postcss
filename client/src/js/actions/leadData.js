import {
  LEAD_DATA_REQUEST,
  LEAD_DATA_DATE_SELECT,
  LEAD_DATA_TABLE_SET_FILTERED_DATA,
  LEAD_DATA_TABLE_FILTER_HEADERS,
  LEAD_DATA_TABLE_FILTER_SETTINGS,
  LEAD_DATA_DOWNLOAD_CSV,
} from 'actions/actionTypes';

export function leadDataRequest(payload = {}) {
  console.log("leadDataRequest::payload ->", payload);
  return {
    type: LEAD_DATA_REQUEST,
    payload: payload,
  }
}

export function dateSelect(payload = {}) {
  return {
    type: LEAD_DATA_DATE_SELECT,
    payload: payload,
  }
}

export function setFilteredData(payload = {}) {
  return {
    type: LEAD_DATA_TABLE_SET_FILTERED_DATA,
    payload: payload,
  }
}

export function downloadCSV(payload = {}) {
  return {
    type: LEAD_DATA_DOWNLOAD_CSV,
    payload: payload,
  }
}

export function tableFilterHeaders(payload = {}) {
  return {
    type: LEAD_DATA_TABLE_FILTER_HEADERS,
    payload: payload,
  }
}

export function updateLeadFilterSettings(payload = {}) {
  return {
    type: LEAD_DATA_TABLE_FILTER_SETTINGS,
    payload: payload,
  }
}
