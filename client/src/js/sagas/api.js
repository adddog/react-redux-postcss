import { select } from 'redux-saga/effects';
import 'whatwg-fetch';
import queryString from 'query-string';

import { isError, isObject, isEmpty } from 'lodash';

export function* getToken(payload = {}) {
  const authToken = yield select(state => {
    return state.auth.get('token');
  });
  return payload.token || authToken;
}

export const JsonApiRequest = (url, options = {}) => {
  const query = isEmpty(options.query)
    ? ''
    : `?${queryString.stringify(options.query)}`;
  const fetchOptions = Object.assign({}, { method: 'GET', ...options });
  console.log("fetchOptions:", fetchOptions);
  return fetch(`${url}${query}`, fetchOptions)
    .then(function(response) {
      if (response.status >= 400) {
        return new Error('Bad response from server');
      }
      console.log('response is', response);
      return response.text();
    })
    .then(data => {
      return data ? JSON.parse(data) : {}
    })
    .catch(err => {
      return { response: err };
    });
};

export const postRequest = (url, options = {}) => {
  const fetchOptions = Object.assign({}, { method: 'POST', ...options });

  return fetch(url, fetchOptions)
    .then(function(response) {
      if (response.status >= 400) {
        return new Error('Bad response from server');
      }
      return response.json();
    })
    .catch(err => {
      return { response: err };
    });
};

export const hasError = response => {
  return isError(response) || isError(response.response);
};
