import { call, put, takeLatest } from 'redux-saga/effects';
import copy from '../../../dist/json/copy.json';

import { COPY_SET, COPY_REQUEST } from 'actions/actionTypes';

import { JsonApiRequest, hasError } from './api';

const API = payload => {
  //TODO api hook
  if (copy) {
    return copy;
  } else {
    console.error('Unable to import copy.json!');
  }
};

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
