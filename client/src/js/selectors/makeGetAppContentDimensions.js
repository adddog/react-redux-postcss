import { createSelector } from 'reselect';
import { forIn, isEmpty, map } from 'lodash';

export const getAppContentDimensions = state => {
  const dimensions = state.components.get('dimensions');
  const { width, height } = state.browser;
  if (!isEmpty(dimensions)) {
    return {
      width: width,
      height: height - dimensions['NavigationContainer'].height
    };
  }
  return {
    width,
    height
  };
};

export const makeGetAppContentDimensions = () =>
  createSelector(
    [state => getAppContentDimensions(state)],
    calculatedDimensions => {
      return calculatedDimensions;
    }
  );

export default makeGetAppContentDimensions;
