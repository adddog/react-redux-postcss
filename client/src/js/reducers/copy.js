import { COPY_SET } from 'actions/actionTypes';

import { Map } from 'immutable';

const initialState = new Map().set('copy', {});

export default function auth(state = initialState, action) {
  switch (action.type) {
    case COPY_SET: {
      const { response } = action;
      return state.set('copy', response);
    }
    default: {
      return state;
    }
  }
}
