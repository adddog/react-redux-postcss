import { premiumPartnerApi, saveSettings,getAllSchools } from './apiSaga';
import { login, logout } from './loginSaga';
import resize from './resizeSaga';
import {
  imageUpload,
  videoLinkValidation,
  videoLinkConfirmed,
  publishViewbook
} from './dashboardSaga';
import componentUI from './componentUISaga';
//import settings from './settingsSaga';
import copy from './copySaga';
import { leadData } from './leadDataSaga';
import { leadDataDate } from './leadDataSaga';
import { performanceHearts } from './performanceSaga';
import { csvDownload } from './leadDataSaga';
import { all, call, spawn } from 'redux-saga/effects';

/*
https://github.com/redux-saga/redux-saga/issues/760
*/

const makeRestartable = saga => {
  return function*() {
    yield spawn(function*() {
      while (true) {
        try {
          yield call(saga);
          console.error(
            'unexpected root saga termination. The root sagas are supposed to be sagas that live during the whole app lifetime!',
            saga
          );
        } catch (e) {
          console.error('Saga error, the saga will be restarted', e);
        }
        yield delay(1000); // Avoid infinite failures blocking app TODO use backoff retry policy...
      }
    });
  };
};

const rootSagas = [
  login,
  saveSettings,
  getAllSchools,
  premiumPartnerApi,
  resize,
  copy,
  //settings,
  videoLinkValidation,
  videoLinkConfirmed,
  publishViewbook,
  performanceHearts,
  imageUpload,
  componentUI,
  leadData,
  csvDownload,
  leadDataDate
].map(makeRestartable);

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)));
}
