import { call, put, takeLatest } from 'redux-saga/effects';

import { COPY_SET, COPY_REQUEST } from 'actions/actionTypes';

import { JsonApiRequest, hasError } from './api';

const API = (payload) => {
    //TODO api hook
    const api = process.env.DEV ? "/json/copy.json" : "";
    return JsonApiRequest(api)
}

function* makeCopyRequest() {
  const copy = yield call(API);
  if (hasError(copy)) {
  } else {
    yield put({ type: COPY_SET, response: copy });
  }
}

export default function* copySaga() {
  yield takeLatest(COPY_REQUEST, makeCopyRequest);
}
