import { createSelector } from 'reselect';
import { isNil } from 'lodash';

export const getIndexRequiringMedia = parsedGalleryData => {
  let v;
  for (let i = 0; i <= parsedGalleryData.length; i++) {
    v = i;
    if (!parsedGalleryData[i]) break;
    if (!parsedGalleryData[i].caption) break;
    if (!parsedGalleryData[i].hasMedia) break;
  }
  return v;
};

export const getNextTileIndex = state => {
  const { dashboard = state } = state;
  const viewbookSelectedMediaIndex = dashboard.get(
    'viewbookSelectedMediaIndex'
  );
  return viewbookSelectedMediaIndex + 1 % dashboard.get('viewbookMediaMax');
};

export const getHasViewbookVideoError = state => {
  const { dashboard = state } = state;
  return dashboard.get('hasViewbookVideoError');
};
