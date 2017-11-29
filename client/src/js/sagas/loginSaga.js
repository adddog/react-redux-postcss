import { call, select, put, takeLatest } from 'redux-saga/effects';

import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS,
  LEAD_DATA_SUCCESS
} from 'actions/actionTypes';

import { JsonApiRequest, hasError } from './api';

const loginAPICall = payload => {
  return JsonApiRequest(`${process.env.GO_API}v1/auth`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: `username=${payload.username}&password=${payload.password}`
  });
};

const logoutAPICall = payload => {
  // check goserver route
  return JsonApiRequest(`${process.env.GO_API}v1/logout`, {
    method: 'GET'
  });
};

function* makeLoginReuqest(action) {
  const { payload } = action;
  const { formSubmitted } = payload;
  const login = yield call(loginAPICall, payload);
  console.log('login: ', login);
  if (!login.jwt || hasError(login)) {
    yield put({
      type: AUTH_LOGIN_ERROR,
      error: {
        ...login,
        ...{ formSubmitted }
      }
    });
  } else {
    yield put({
      type: AUTH_LOGIN_SUCCESS,
      user: {
        ...login,
        ...{ remember: payload.remember },
        ...{ formSubmitted }
      }
    });
  }
}

function* makeLogoutReuqest(action) {
  const { payload } = action;
  const { formSubmitted } = payload;
  const logout = yield call(logoutAPICall, payload);
  console.log('logout: ', logout);
  if (hasError(logout)) {
    console.log('logout err!');
  } else {
    yield put({
      type: AUTH_LOGOUT_SUCCESS
    });
  }
}

export function* login() {
  yield takeLatest(AUTH_LOGIN, makeLoginReuqest);
}

export function* logout() {
  yield takeLatest(AUTH_LOGOUT, makeLogoutRequest);
}
