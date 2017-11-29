import { call, put, takeLatest } from 'redux-saga/effects';

import { SETTINGS_SET, SETTINGS_REQUEST } from 'actions/actionTypes';

import { JsonApiRequest, hasError } from './api';


const API = (payload) => {
    //TODO api hook
    const api = process.env.DEV ? "/json/settings.json" : "";
    console.log(api);
    return JsonApiRequest(api)
}

function* makeSettingsRequest() {
  return
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