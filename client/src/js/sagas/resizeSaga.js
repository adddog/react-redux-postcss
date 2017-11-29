import { RESIZE, SET_DIMENSIONS } from 'actions/actionTypes';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { ComponentUIDataRef } from 'utils/utils';
import { forIn } from 'lodash';

const getDimentions = el => {
  if (!el) return {};
  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  };
};

function* calcDimentions(action) {
  const dimensions = {};

  forIn(ComponentUIDataRef, (val, key) => {
    dimensions[key] = getDimentions(
      document.querySelector(`[data-ui-ref=${key}]`)
    );
  });
  yield put({ type: SET_DIMENSIONS, dimensions });
}

export default function* resizeSaga() {
  yield takeLatest(RESIZE, calcDimentions);
}
