import { createSelector } from 'reselect';
import { forIn, isEmpty, map } from 'lodash';

import {
  DASHBOARD_PAGE_CONTAINER__COLUMN,
  DASHBOARD_PAGE_UPLOAD_MEDIA_COMPONENT,
  DASHBOARD_PAGE_DASHBOARD_TEXT_CAPTION_COMPONENT,
  DASHBOARD_PAGE_DASHBOARD_PUBLISH_COMPONENT
} from 'utils/styling';

export const getDashboardMediaThumbDimensions = (state, name) => {
  const { components, browser } = state;
  const compDimensions = components.get('componentDimensions');
  const height = [
    DASHBOARD_PAGE_UPLOAD_MEDIA_COMPONENT,
    DASHBOARD_PAGE_DASHBOARD_TEXT_CAPTION_COMPONENT,
    DASHBOARD_PAGE_DASHBOARD_PUBLISH_COMPONENT
  ].reduce((acc, val) => {
    if (!compDimensions[val]) return 0;
    return (acc += compDimensions[val].height);
  }, 0);
  const area = compDimensions[DASHBOARD_PAGE_CONTAINER__COLUMN] || {};
  return area.height - height;
};

export const makeGetDashboardMediaThumbDimensions = () =>
  createSelector(
    [(state, name) => getDashboardMediaThumbDimensions(state, name)],
    style => style
  );

export default makeGetDashboardMediaThumbDimensions;
