import { createSelector } from 'reselect';
import { isNil, first, slice, keys, xor, omit } from 'lodash';

export const getViewbookPublishData = state => {
  /*
        1. Filter data using the date
    */
  let values = state.dashboard.get('viewbook').filter(v => !isNil(v));
  return {
    id: state.auth.get('id_ipeds'),
    data: values
  };
};

export const makeGetViewbookPublishData = () =>
  createSelector([state => getViewbookPublishData(state)], viewbook => {
    return viewbook;
  });

export default makeGetViewbookPublishData;
