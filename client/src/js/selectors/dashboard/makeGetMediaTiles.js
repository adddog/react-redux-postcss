import { createSelector } from 'reselect';
import { isNil, compact } from 'lodash';

export const getMediaTiles = state => {
  const { dashboard } = state;

  const viewbook = [...dashboard.get('viewbook')];
  const grabbedMediaTargetTileIndex = dashboard.get(
    'grabbedMediaTargetTileIndex'
  );
  const grabbedMediaTile = dashboard.get('grabbedMediaTile');
  //fill with empty
  if (!isNil(grabbedMediaTargetTileIndex)) {
    viewbook.splice(grabbedMediaTargetTileIndex, 0, {});
  }
  return compact(viewbook);
};

export const makeGetMediaTiles = () =>
  createSelector([state => getMediaTiles(state)], tiles => {
    return tiles;
  });

export default makeGetMediaTiles;
