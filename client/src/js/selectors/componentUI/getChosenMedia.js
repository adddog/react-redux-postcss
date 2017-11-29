import { createSelector } from 'reselect';
import { forIn, isEmpty, map } from 'lodash';
import parse from 'path-parse';

export const getChosenMedia = state => {
  const file = state.dashboard.get('viewbookImageChosen');
  if (!file) return null;
  return file;
};
