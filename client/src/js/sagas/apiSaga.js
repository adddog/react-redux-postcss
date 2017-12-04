import { merge, isError } from "lodash"
import { delay } from "redux-saga"
import { call, put, takeLatest, select } from "redux-saga/effects"

import {
  API_SETTINGS_POST,
  PREMIUM_PARTNER_REQUEST,
  PREMIUM_PARTNER_SUCCESS,
  PREMIUM_PARTNER_ERROR,
  SETTINGS_SET,
  API_ALL_SCHOOLS_REQUEST,
  API_ALL_SCHOOLS_SUCCESS
} from "actions/actionTypes"

import {
  JsonApiRequest,
  postRequest,
  getToken,
  hasError,
} from "./api"

import { getAppSettings } from "selectors/makeGetAppSettings"

const API_PREMIUM_PARTNER_GET = (token, query = {}) => {
  console.log("query:", query)
  return JsonApiRequest(`${process.env.GO_API}v1/partner`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `bearer ${token}`,
    },
    query,
  })
}

const API_SETTINGS = (token, body) => {
  return postRequest(`${process.env.GO_API}v1/partner/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body,
  })
}

function* makePremiumPartnerRequest(action) {
  const payload = action.payload || {}
  const token = yield getToken(payload)

  const ipeds = yield select(state => state.auth.get("id_ipeds"))
  if (ipeds) {
    const premiumPartnerData = yield call(
      API_PREMIUM_PARTNER_GET,
      token,
      {
        id: ipeds,
      }
    )
  } else {
    let apiCallFeedback = ipeds ? premiumPartnerData : 'no ipeds in state, skipping api call'
    yield put({
      type: PREMIUM_PARTNER_ERROR,
      response: apiCallFeedback,
    })
  }
}

const GET_ALL_SCHOOLS_API = () => {
    return JsonApiRequest(`${process.env.DEV ? "/json/schools.json" : ""}`)
}

function* makeGetAllSchools() {
  const schools = yield call(
    GET_ALL_SCHOOLS_API
  )
  if (hasError(schools)) {
    console.error(`FAILED TO GET ALL SCHOOLS`)
  } else {
    yield put({
      type: API_ALL_SCHOOLS_SUCCESS,
      response: schools,
    })
  }
}

export function* getAllSchools() {
  yield takeLatest(API_ALL_SCHOOLS_REQUEST, makeGetAllSchools)
}

export function* premiumPartnerApi() {
  yield takeLatest(PREMIUM_PARTNER_REQUEST, makePremiumPartnerRequest)
}

function* doDashboardSettings(action) {
  yield call(delay, 3000)
  const settings = yield select(getAppSettings)
  const token = yield getToken()
  const publishResponse = yield call(
    API_SETTINGS,
    token,
    JSON.stringify(settings)
  )
}

export function* saveSettings() {
  yield takeLatest(API_SETTINGS_POST, doDashboardSettings)
}
