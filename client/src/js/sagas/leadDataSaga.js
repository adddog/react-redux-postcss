import {
  call,
  fork,
  select,
  cancel,
  put,
  takeLatest,
  takeEvery
} from 'redux-saga/effects';

import moment from 'moment';

import {
  COMP_HIDE_SPINNER,
  COMP_SHOW_SPINNER,
  AUTH_LOGIN_ERROR,
  LEAD_DATA_REQUEST,
  LEAD_DATA_ERROR,
  LEAD_DATA_SUCCESS,
  LEAD_DATA_DOWNLOAD_CSV,
  LEAD_DATA_DOWNLOAD_CSV_ERROR,
  LEAD_DATA_FILTER_WARN,
  LEAD_DATA_DATE_SELECT,
  IS_LOADING_LEADS,
  IS_DONE_LOADING_LEADS,
  SET_YEAR_RANGE,
  SET_YEAR_RANGE_VALUES
} from 'actions/actionTypes';

import { uniq, map, pick, xor, keys, first, last, omit, find, isNil, isEmpty } from 'lodash';
import QS from 'query-string';
import S from 'string';
import { MOMEMT } from 'utils/utils';
import json2csv from 'json2csv';
import { JsonApiRequest, hasError, getToken } from './api';
import { downloadCSV } from 'utils/utils';

import { getDateSelectedLeadData } from 'selectors/leadData/makeGetDateSelectedLeadData';
import {
  getTableFilterHeaders,
  getTableSelectedColumns
} from 'selectors/leadData/makeGetTableSelectedColumns';

//**-----------
//**** LEAD_DATA_REQUEST
//**-----------
const API_HANDSHAKE = payload => {
  return JsonApiRequest(`${process.env.GO_API}v1/handshake`, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: `bearer ${payload.token}`
    }
  });
};

const API_VBSCHOOLS = payload => {
  // console.log('Invoking API_VBSCHOOLS');
  return JsonApiRequest(`${process.env.API_HOST}api/vbschools`, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: `bearer ${payload.token}`
    }
  });
};

const API_LEADS_FOR_DATE_RANGE = payload => {
  // console.log('Invoking API_LEADS_FOR_DATE_RANGE');
  console.log('payload::', payload);
  return JsonApiRequest(`${process.env.GO_API}v1/leads`, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      id: payload.id,
      start: payload.start,
      end: payload.end,
      Authorization: `bearer ${payload.token}`
    }
  });
};

function* makeLeadDataRequest(action) {
  const { payload } = action;
  const state = yield select();
  let endMoment = moment(Date.now());
  let endMomentFormatted = endMoment.format('YYYY-MM-DD');
  let startMoment = moment(endMoment).subtract(1, 'year');
  let startMomentFormatted = startMoment.format('YYYY-MM-DD');
  yield put({ type: SET_YEAR_RANGE, start: startMoment, end: endMoment });
  const token = yield getToken();
  yield put({ type: COMP_SHOW_SPINNER });
  const handshake = yield call(API_HANDSHAKE, { token });
  //assume we are getting a falsy value back
  if (hasError(handshake)) {
    yield put({ type: COMP_HIDE_SPINNER });
    yield put({ type: AUTH_LOGIN_ERROR, error: handshake });
  } else {
    yield put({ type: COMP_SHOW_SPINNER });

    let yearStart = state.leadData.get('yearStart');
    let yearEnd = state.leadData.get('yearEnd');
    let yearlyResponse = state.leadData.get('yearlyResponse');

    let leadDataResponse;

    if (
      !isNil(yearStart) &&
      !isEmpty(yearStart) &&
      !isNil(yearEnd) &&
      !isEmpty(yearEnd) &&
      !isNil(yearlyResponse) &&
      !isEmpty(yearlyResponse) &&
      yearStart.format('YYYY-MM-DD') === startMomentFormatted &&
      yearEnd.format('YYYY-MM-DD') === endMomentFormatted
    ) {
      console.log('We already have this data! skipping api')
      leadDataResponse = yearlyResponse
    } else {
      console.log('No yearly can, hitting API')
      leadDataResponse = yield call(API_LEADS_FOR_DATE_RANGE, {
        token,
        start: startMomentFormatted,
        end: endMomentFormatted,
        id: state.auth.get('id_ipeds')
      });
      yield put({
        type: SET_YEAR_RANGE_VALUES,
        response: leadDataResponse
      })
    }

    yield put({ type: IS_DONE_LOADING_LEADS });
    yield put({ type: COMP_HIDE_SPINNER });
    yield put({
      type: LEAD_DATA_SUCCESS,
      response: leadDataResponse,
      start: startMoment,
      end: endMoment
    });

  }
}

/*---------------------
**** makeNewDateLeadRequest
Happens when date ranges change, can handle internal or external.
*/
function* makeNewDateLeadRequest(action) {
  const { payload } = action;
  const state = yield select();
  const token = yield getToken();
  let newDateStart = state.leadData.get('dateSelected').startUnix;
  let newDateEnd = state.leadData.get('dateSelected').valueOf();
  let oldDateStart = state.leadData.get('yearStartUnix');
  let oldDateEnd = state.leadData.get('yearEndUnix');
  // console.log('yearLeadDataValues', state.leadData.get('yearLeadDataValues'));
  // console.log('newDateStart', newDateStart, 'oldDateStart', oldDateStart);
  // console.log('newDateEnd', newDateEnd, 'oldDateEnd', oldDateEnd);
  if (newDateStart < oldDateStart || newDateEnd > oldDateEnd) {
    const handshake = yield call(API_HANDSHAKE, { token });
    if (hasError(handshake)) {
      yield put({ type: COMP_HIDE_SPINNER });
      yield put({ type: AUTH_LOGIN_ERROR, error: handshake });
    } else {
      yield put({ type: IS_LOADING_LEADS });
      yield put({ type: COMP_SHOW_SPINNER });
      const leadDataResponse = yield call(API_LEADS_FOR_DATE_RANGE, {
        token,
        start: state.leadData.get('dateSelected').start.format('YYYY-MM-DD'),
        end: state.leadData.get('dateSelected').end.format('YYYY-MM-DD'),
        id: state.auth.get('id_ipeds')
      });
      yield put({ type: IS_DONE_LOADING_LEADS });
      yield put({ type: COMP_HIDE_SPINNER });
      yield put({ type: LEAD_DATA_SUCCESS, response: leadDataResponse });
    }
  } else {
    console.error('WE SHOULD ALREADY HAVE THIS DATA!!!');
  }
}

export function* leadData() {
  yield takeLatest(LEAD_DATA_REQUEST, makeLeadDataRequest);
}

export function* leadDataDate() {
  yield takeLatest(LEAD_DATA_DATE_SELECT, makeNewDateLeadRequest);
}

//**-----------
//**** LEAD_DATA_DOWNLOAD_CSV
//**-----------

export function* csvDownload() {
  yield takeLatest(LEAD_DATA_DOWNLOAD_CSV, makeCSVDownload);
}

const processCSVFile = (data, filteredColumnLabels, name) => {
  const result = json2csv({
    data: data,
    fields: filteredColumnLabels
  });
  //TODO: title
  const title = `${name.start}-${name.end}`;
  downloadCSV(result, title);
};

const getCSVName = data => {
  return {
    start: MOMEMT.mdy(first(data).createdAt),
    end: MOMEMT.mdy(last(data).createdAt)
  };
};

function* makeCSVDownload(action) {
  const leadData = yield select(getDateSelectedLeadData);
  const copy = yield select(state => state.copy.get('copy').csvExport);
  //get all the keys
  const settings = yield select(state =>
    state.leadData.get('tableFilterCSVExportSettings')
  );
  const {
    visibleTableColumnsKeys,
    selectedTableColumnsKeys,
    filteredColumnKeys
  } = yield select(getTableSelectedColumns);

  const tableFilterHeadersOriginal = yield select(state =>
    state.leadData.get('tableFilterHeadersOriginal')
  );

  const chosenFilteredColumnKeys = settings.onlyVisibleColumns
    ? uniq([...visibleTableColumnsKeys, ...filteredColumnKeys])
    : selectedTableColumnsKeys;

  const filteredData = yield select(state =>
    state.leadData.get('filteredData')
  );

  //Export this
  let dataToUse =
    filteredData.length && settings.useTableFilterForExport
      ? filteredData
      : leadData;

  if (!dataToUse) {
    yield cancel();
  }

  if (settings.useColummnsForExport) {
    if (!chosenFilteredColumnKeys.length) {
      yield put({
        type: LEAD_DATA_FILTER_WARN,
        message: copy.filteredColumnValuesLengthWarning
      });
    }

    //custom csv: match filtered headers
    dataToUse = dataToUse.map(d => pick(d, chosenFilteredColumnKeys));
  }

  if (!leadData.length) {
    yield put({
      type: LEAD_DATA_FILTER_WARN,
      message: copy.filteredColumnValuesLengthWarning
    });
  } else {
    processCSVFile(
      dataToUse,
      chosenFilteredColumnKeys.map(key =>
        find(tableFilterHeadersOriginal, { value: key })
      ),
      getCSVName(leadData)
    );
  }
}
