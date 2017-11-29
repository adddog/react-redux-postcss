import {
  STYLE_SET,
  SET_DIMENSIONS,
  SET_COMP_DIMENSIONS,
  COMP_HIDE_SPINNER,
  COMP_SHOW_SPINNER,
  COMP_TOGGLE_MENU,
  COMP_TOGGLE_CALENDAR_VISIBILITY,
  COMP_OPEN_MODAL,
  COMP_CLOSE_MODAL
} from 'actions/actionTypes';

import { mapValues, keys, clone, forIn, isObject } from 'lodash';
import { Map } from 'immutable';

const initialState = new Map()
  //general
  .set('style', {})
  .set('componentDimensions', {})
  .set('dimensions', {})
  //side menu
  .set('isSideMenuOpen', false)
  //lead data
  .set('isCalendarVisible', false)
  //modal
  .set('isModalVisible', false)
  .set('modalType', null)
  //loader
  .set('isLoaderVisible', false);

const RESERVED_PROPS = ['backgroundColor', 'background'];

const hasReservedProp = keys =>
  !!keys.filter(key => RESERVED_PROPS.indexOf(key) > -1).length;
const isReservedProp = key => !!(RESERVED_PROPS.indexOf(key) > -1);

const styleLoop = (component, style, i = 0) => {
  console.log(component);
  mapValues(component, (val, key) => {
    console.log(key);
    if (isReservedProp(key)) {
      component[key] = style.palette[val];
      return component;
    } else {
      console.log(val, key);
      /*styleLoop({
          [val]:key
        }, style, i)*/
    }
  });
};
export default function componentUI(state = initialState, action) {
  switch (action.type) {
    case SET_DIMENSIONS: {
      const { dimensions } = action;
      return state.set('dimensions', dimensions);
    }
    case SET_COMP_DIMENSIONS: {
      const { payload } = action;
      return state.set('componentDimensions', {
        ...state.get('componentDimensions'),
        [payload.name]: payload.dimensions
      });
    }
    case STYLE_SET: {
      const { payload } = action;
      let style = payload;
      forIn(style.components, (component, key) => {
        styleLoop(component, style);
      });
      return state.set('style', style);
    }
    case COMP_TOGGLE_MENU: {
      return state.set('isSideMenuOpen', !state.get('isSideMenuOpen'));
    }
    case COMP_TOGGLE_CALENDAR_VISIBILITY: {
      return state.set('isCalendarVisible', !state.get('isCalendarVisible'));
    }
    case COMP_OPEN_MODAL: {
      const { payload } = action;
      return state.set('isModalVisible', true).set('modalType', payload);
    }
    case COMP_CLOSE_MODAL: {
      return state.set('isModalVisible', false).set('modalType', null);
    }
    case COMP_SHOW_SPINNER: {
      return state.set('isLoaderVisible', true);
    }
    case COMP_HIDE_SPINNER: {
      return state.set('isLoaderVisible', false);
    }
    default: {
      return state;
    }
  }
}
