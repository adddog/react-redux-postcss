import { createSelector } from 'reselect';
import { filter } from 'lodash';

export const getInstructions = (data, name) => {
  const instructions = data.get('instructions');
  return filter(instructions, {
    component: name,
    closed: false
  });
};
