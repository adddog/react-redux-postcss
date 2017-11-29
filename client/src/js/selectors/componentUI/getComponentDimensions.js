import { createSelector } from 'reselect';
import { forIn, isEmpty, map } from 'lodash';
import parse from 'path-parse';

export const getComponentDimensions = (state, name) => {
  if (!name) return null;
  return state.components.get('componentDimensions')[name];
};
