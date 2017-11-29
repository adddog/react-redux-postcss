import { createSelector } from 'reselect';
import { isNil } from 'lodash';
import { getMediaTiles } from 'selectors/dashboard/makeGetMediaTiles';

export const getSortedDragSelectedIndexs = state => {
  const { dashboard = state } = state;
  const viewbookDragSelectedMediaIndexs = dashboard.get(
    'viewbookDragSelectedMediaIndexs'
  );
  const indexes = viewbookDragSelectedMediaIndexs
    .filter(v => v.value)
    .map(v => v.index);

  indexes.sort((a, b) => a - b);

  return indexes || [];
};

export const getDragSelectedTiles = (state, viewbook) => {
  const { dashboard = state } = state;
  viewbook = viewbook || getMediaTiles(state);
  const viewbookDragSelectedMediaIndexs = dashboard.get(
    'viewbookDragSelectedMediaIndexs'
  );

  const indexes = viewbookDragSelectedMediaIndexs
    .filter(v => v.value)
    .map(v => v.index);

  indexes.sort((a, b) => a - b);

  return indexes
    .map(index => viewbook[index])
    .filter(item => !!item)
    .filter(item => item.hasMedia);
};

const makeGetDragSelectedTiles = () =>
  createSelector([state => getDragSelectedTiles(state)], tiles => {
    return tiles;
  });

export default makeGetDragSelectedTiles;
