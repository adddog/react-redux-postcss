import { ROUTES } from 'routes/configureRoutes';

import { List, Map } from 'immutable';

const initialState = new Map(ROUTES);

export default function routes(state = initialState, action) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
