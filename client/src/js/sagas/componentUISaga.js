import { call, put, takeLatest } from 'redux-saga/effects';

import { STYLE_SET, STYLE_REQUEST } from 'actions/actionTypes';

import { JsonApiRequest, hasError } from './api';

const API = payload => {
  //TODO api hook
  const api = process.env.DEV ? '/json/color_palette.json' : '';
  return JsonApiRequest(api);
};

function* makeStyleRequest() {
  const style = yield call(API);
  if (hasError(style)) {
    yield put({ type: STYLE_SET, payload: {} });
  } else {
    yield put({ type: STYLE_SET, payload: style });
  }
}

export default function* componentUISaga() {
  yield takeLatest(STYLE_REQUEST, makeStyleRequest);
}
