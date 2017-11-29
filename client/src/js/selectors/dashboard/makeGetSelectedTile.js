import { createSelector } from 'reselect';
import { isNil } from 'lodash';

export const getSelectedTile = state => {
  const { dashboard = state } = state;
  const viewbook = [...dashboard.get('viewbook')];
  const viewbookSelectedMediaIndex = dashboard.get(
    'viewbookSelectedMediaIndex'
  );
  return viewbook[viewbookSelectedMediaIndex] || {};
};

const makeGetSelectedTile = () =>
  createSelector([state => getSelectedTile(state)], tiles => {
    return tiles;
  });

export default makeGetSelectedTile;
