import {
  PERFORMANCE_HEARTS_SUCCESS,
  PERFORMANCE_HEARTS_ERROR
} from 'actions/actionTypes';
import moment from 'moment';
import { Map } from 'immutable';
import { values } from 'lodash';
const initialState = new Map().set('hearts', {});

const parseHeartData = data => {
  return values(
    data.reduce((ac, v) => {
      if (ac[v.first_pinned_date]) {
        ac[v.first_pinned_date].values.push(v);
        ac[v.first_pinned_date].amt = ac[v.first_pinned_date].values.length;
      } else {
        ac[v.first_pinned_date] = {
          name: v.first_pinned_date,
          humanDate: moment(v.first_pinned_date).format('dddd MMMM Do YYYY'),
          label: 'Hearts',
          values: [v],
          amt: 1
        };
      }
      return ac;
    }, {})
  );
};

export default function performance(state = initialState, action) {
  switch (action.type) {
    case PERFORMANCE_HEARTS_SUCCESS: {
      const { response } = action;
      return state.set('hearts', {
        data: parseHeartData(response),
        title: 'Number of hearts'
      });
    }
    case PERFORMANCE_HEARTS_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
