import { call, put, takeLatest } from 'redux-saga/effects';

import { SETTINGS_SET, SETTINGS_REQUEST } from 'actions/actionTypes';

import { JsonApiRequest, hasError } from './api';
import settings from '../../../dist/json/settings.json'

const API = payload => {
  //TODO api hook
  if (settings) {
    return settings
  }
};

function* makeSettingsRequest() {
  const settings = yield call(API);
  if (hasError(settings)) {
    console.error("error getting settings, ", error);
  } else {
    yield put({ type: SETTINGS_SET, response: settings });
  }
}

export default function* settingsSaga() {
  yield takeLatest(SETTINGS_REQUEST, makeSettingsRequest);
}