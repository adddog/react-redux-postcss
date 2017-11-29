import { createSelector } from 'reselect';
import { forIn, isEmpty, map } from 'lodash';

export const getAppSettings = state => {
  return {
    id: process.env.IPEDS,
    data: {
      leadDataFilteredHeaders: state.leadData
        .get('tableFilterHeaders')
        .map(d => d.value)
    }
  };
};

export const makeGetAppSettings = () =>
  createSelector([state => getAppSettings(state)], appSettings => appSettings);

export default makeGetAppSettings;
