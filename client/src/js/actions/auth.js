import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_LOGIN_SUCCESS,
} from 'actions/actionTypes';

export function login(payload = {}) {
  return {
    type: AUTH_LOGIN,
    payload: payload,
  }
}

export function logout(payload = {}) {
  return {
    type: AUTH_LOGOUT,
    payload: payload,
  }
}

export function loginSuccess(payload = {}) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    payload: payload
  };
}
