import { merge, isError } from 'lodash';
import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';

import {
  API_SETTINGS_POST,
  PREMIUM_PARTNER_REQUEST,
  PREMIUM_PARTNER_SUCCESS,
  PREMIUM_PARTNER_ERROR,
  SETTINGS_SET
} from 'actions/actionTypes';

import { JsonApiRequest, postRequest, getToken, hasError } from './api';

import { getAppSettings } from 'selectors/makeGetAppSettings';

const API_PREMIUM_PARTNER_GET = (token, query = {}) => {
  console.log('query:', query);
  return JsonApiRequest(`${process.env.GO_API}v1/partner`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `bearer ${token}`
    },
    query
  });
};

const API_PREMIUM_PARTNER_NEW = (token, body = {}, headers = {}) => {
  return postRequest(`${process.env.GO_API}v1/partner`, {
    headers: merge(
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `bearer ${token}`
      },
      headers
    ),
    body
  });
};

const API_SETTINGS = (token, body) => {
  return postRequest(`${process.env.GO_API}v1/partner/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body
  });
};

function* makePremiumPartnerRequest(action) {
  const payload = action.payload || {};
  const token = yield getToken(payload);

  const ipeds = yield select(state => state.auth.get('id_ipeds'));
  const premiumPartnerData = yield call(API_PREMIUM_PARTNER_GET, token, {
    id: ipeds
  });

  if (isError(premiumPartnerData.response)) {
    yield put({
      type: PREMIUM_PARTNER_ERROR,
      response: premiumPartnerData
    });
  } else {
    //NO SCHOOL
    if (hasError(premiumPartnerData)) {
      const ipeds = yield select(state => state.auth.get('id_ipeds'));
      //NEW SCHOOL
      const newSchoolData = yield call(
        API_PREMIUM_PARTNER_NEW,
        token,
        JSON.stringify({
          id: ipeds
        }),
        { 'Content-Type': 'application/json' }
      );
      if (hasError(newSchoolData)) {
      }
      yield put({
        type: PREMIUM_PARTNER_SUCCESS,
        response: newSchoolData
      });
    } else {
      yield put({
        type: PREMIUM_PARTNER_SUCCESS,
        response: premiumPartnerData
      });
    }
  }
}

export function* premiumPartnerApi() {
  yield takeLatest(PREMIUM_PARTNER_REQUEST, makePremiumPartnerRequest);
}

function* doDashboardSettings(action) {
  yield call(delay, 3000);
  const settings = yield select(getAppSettings);
  const token = yield getToken();
  const publishResponse = yield call(
    API_SETTINGS,
    token,
    JSON.stringify(settings)
  );
}

export function* saveSettings() {
  yield takeLatest(API_SETTINGS_POST, doDashboardSettings);
}
