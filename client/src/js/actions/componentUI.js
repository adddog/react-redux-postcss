import {
  SET_COMP_DIMENSIONS,
  COMP_TOGGLE_MENU,
  COMP_TOGGLE_CALENDAR_VISIBILITY,
  COMP_OPEN_MODAL,
  COMP_CLOSE_MODAL
} from 'actions/actionTypes';

export function setComponentDimensions(payload = {}) {
  return {
    type: SET_COMP_DIMENSIONS,
    payload: payload
  };
}
export function toggleMenu(payload = {}) {
  return {
    type: COMP_TOGGLE_MENU,
    payload: payload
  };
}

export function toggleCalendar(payload = {}) {
  return {
    type: COMP_TOGGLE_CALENDAR_VISIBILITY,
    payload: payload
  };
}

export function openModal(payload = {}) {
  return {
    type: COMP_OPEN_MODAL,
    payload: payload
  };
}

export function closeModal(payload = {}) {
  return {
    type: COMP_CLOSE_MODAL,
    payload: payload
  };
}
