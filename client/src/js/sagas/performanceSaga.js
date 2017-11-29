require('es6-promise').polyfill()
import moment from 'moment'
import { call, cancel, put, takeLatest, select } from 'redux-saga/effects'

import {
  COMP_HIDE_SPINNER,
  COMP_SHOW_SPINNER,
  PERFORMANCE_HEARTS_REQUEST,
  PERFORMANCE_HEARTS_SUCCESS,
  PERFORMANCE_HEARTS_ERROR,
  SET_YEAR_RANGE,
  SET_YEARLY_LEAD_DATA,
  SET_YEAR_RANGE_VALUES
} from 'actions/actionTypes'

import { JsonApiRequest, postRequest, getToken, hasError } from './api'

import { merge, isError, isEmpty, isNil } from 'lodash'
import fetch from 'isomorphic-fetch'
//**-----------
//**** API CALLS
//**-----------
const API_HEARTS = payload => {
  console.log('GO_API', process.env.GO_API)
  return JsonApiRequest(`${process.env.GO_API}v1/leads`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `bearer ${payload.token}`,
      id: payload.id,
      start: payload.start,
      end: payload.end
    },
    query: payload.query
  })
}

function* makePerformanceHeartsRequest(action) {
  const token = yield getToken()
  const state = yield select()
  yield put({ type: COMP_SHOW_SPINNER })
  let endMoment = moment(Date.now()).endOf('day')
  let endMomentFormatted = endMoment.format('YYYY-MM-DD')
  let startMoment = moment(endMoment)
    .subtract(1, 'year')
    .startOf('day')
  let startMomentFormatted = startMoment.format('YYYY-MM-DD')
  let ipedsId = state.auth.get('id_ipeds')

  let yearStart = state.leadData.get('yearStart')
  let yearEnd = state.leadData.get('yearEnd')
  let yearly = state.leadData.get('yearlyResponse')

  let response;
  if (
    !isNil(yearStart) &&
    !isEmpty(yearStart) &&
    !isNil(yearEnd) &&
    !isEmpty(yearEnd) &&
    !isNil(yearly) &&
    !isEmpty(yearly) &&
    yearStart.format('YYYY-MM-DD') === startMomentFormatted &&
    yearEnd.format('YYYY-MM-DD') === endMomentFormatted
  ) {
    response = yearly
  } else {
    console.log('yearStart', yearStart, 'startMoment', startMoment)
    console.log('yearEnd', yearEnd, 'endMoment', endMoment)
    console.log('yearly', yearly)
    yield put({ type: SET_YEAR_RANGE, start: startMoment, end: endMoment })
    response = yield call(API_HEARTS, {
      token,
      id: ipedsId,
      start: startMomentFormatted,
      end: endMomentFormatted
    })
  }

  console.log('response:', response)
  //assume we are getting a falsy value back
  if (hasError(response)) {
    yield put({ type: COMP_HIDE_SPINNER })
    yield put({ type: PERFORMANCE_HEARTS_ERROR, error: response })
  } else {
    yield put({ type: COMP_HIDE_SPINNER })
    yield put({ type: PERFORMANCE_HEARTS_SUCCESS, response: response })
    yield put({ type: SET_YEAR_RANGE_VALUES, response: response })
  }
}

export function* performanceHearts() {
  yield takeLatest(PERFORMANCE_HEARTS_REQUEST, makePerformanceHeartsRequest)
}
