require('es6-promise').polyfill();
import { call, cancel, put, takeLatest, select } from 'redux-saga/effects';

import {
  AUTH_LOGIN_ERROR,
  DASHB_VIEWBOOK_SELECTED_INDEX,
  DASHB_VIEWBOOK_IMAGE_UPLOAD,
  DASHB_VIEWBOOK_IMAGE_UPLOAD_SUCCESS,
  DASHB_VIEWBOOK_IMAGE_UPLOAD_ERROR,
  DASHB_VIEWBOOK_VIDEO_LINK,
  DASHB_VIEWBOOK_VIDEO_LINK_VALID,
  DASHB_VIEWBOOK_VIDEO_LINK_CONFIRMED,
  DASHB_VIEWBOOK_PUBLISH
} from 'actions/actionTypes';

import { JsonApiRequest, postRequest, getToken, hasError } from './api';

import { getViewbookPublishData } from 'selectors/dashboard/makeGetViewbookPublishData';
import {
  getIndexRequiringMedia,
  getHasViewbookVideoError
} from 'selectors/dashboard/getSelectors';
import { getYoutubeLinkValidation } from 'selectors/componentUI/makeGetModalConfirmation';

import { merge, isError, isEmpty } from 'lodash';
import fetch from 'isomorphic-fetch';
//**-----------
//**** API CALLS
//**-----------
const API_DASHBOARD = payload => {
  return JsonApiRequest(`${process.env.GO_API}v1/dashboard`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `bearer ${payload.token}`
    }
  });
};

const API_IMAGE_UPLOAD = payload => {
  return postRequest(`${process.env.CMS_API_HOST}partner/image`, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${payload.token}`
    },
    body: payload.data
  });
};

const API_PUBLISH = (token, body) => {
  return postRequest(`${process.env.CMS_API_HOST}partner/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body
  });
};

function* doImageUpload(action) {
  const { payload } = action;
  const token = yield getToken(payload);
  const data = new FormData();
  if (isEmpty(payload)) {
    const viewbookImageChosen = yield select(state =>
      state.dashboard.get('viewbookImageChosen')
    );
    if (!viewbookImageChosen) {
      yield cancel();
    }
    data.append('image', viewbookImageChosen[0]);
  } else {
    data.append('image', payload[0]);
  }
  const uploadResponse = yield call(API_IMAGE_UPLOAD, {
    token: token,
    data
  });

  if (!hasError(uploadResponse)) {
    yield put({
      type: DASHB_VIEWBOOK_IMAGE_UPLOAD_SUCCESS,
      response: {
        mimeType: uploadResponse.ref_type,
        url: uploadResponse.file_name
      }
    });
    const nextTileIndex = yield select(getIndexRequiringMedia);
    yield put({
      type: DASHB_VIEWBOOK_SELECTED_INDEX,
      payload: nextTileIndex
    });
  } else {
    yield put({
      type: DASHB_VIEWBOOK_IMAGE_UPLOAD_ERROR,
      response: uploadResponse
    });
  }
}

export function* imageUpload() {
  yield takeLatest(DASHB_VIEWBOOK_IMAGE_UPLOAD, doImageUpload);
}

function* doVideoLinkValidation(action) {
  const regexResult = yield select(state =>
    getYoutubeLinkValidation(state, action)
  );
  yield put({
    type: DASHB_VIEWBOOK_VIDEO_LINK_VALID,
    payload: !!regexResult
  });
}

export function* videoLinkValidation() {
  yield takeLatest(DASHB_VIEWBOOK_VIDEO_LINK, doVideoLinkValidation);
}

function* doVideoLinkConfirmed(action) {
  const nextTileIndex = yield select(getIndexRequiringMedia);
  const hasViewbookVideoError = yield select(getHasViewbookVideoError);
  if (!hasViewbookVideoError) {
    yield put({
      type: DASHB_VIEWBOOK_SELECTED_INDEX,
      payload: nextTileIndex
    });
  }
  yield cancel();
}

export function* videoLinkConfirmed() {
  yield takeLatest(DASHB_VIEWBOOK_VIDEO_LINK_CONFIRMED, doVideoLinkConfirmed);
}

function* doViewbookPublish(action) {
  const viewbook = yield select(getViewbookPublishData);
  const token = yield getToken();
  const publishResponse = yield call(
    API_PUBLISH,
    token,
    JSON.stringify(viewbook)
  );
}

export function* publishViewbook() {
  yield takeLatest(DASHB_VIEWBOOK_PUBLISH, doViewbookPublish);
}
