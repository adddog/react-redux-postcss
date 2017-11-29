import { createSelector } from 'reselect';
import { forIn, isEmpty, map } from 'lodash';

import { NAVIGATION_CONTAINER, LEAD_DATA_PAGE_CONTAINER } from 'utils/styling';

export const getComponentStyle = (state, name) => {
  const { components } = state;
  const style = components.get('style');
  if (isEmpty(style)) return {};
  switch (name) {
    case NAVIGATION_CONTAINER: {
      return {
        navigation: style.components.navigation,
        navigationLinks: style.components.navigationLinks
      };
    }
    case LEAD_DATA_PAGE_CONTAINER: {
      return {
        leadData: style.components.leadData
      };
    }
  }
};

export const makeGetComponentStyle = () =>
  createSelector([(state, name) => getComponentStyle(state, name)], style => {
    return style;
  });

export default makeGetComponentStyle;
