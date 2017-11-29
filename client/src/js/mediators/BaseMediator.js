import { push } from 'react-router-redux';
import { merge } from 'lodash';

export const baseDispatch = (props, dispatch) =>
  merge(props, {
    changeRoute: slug => dispatch(push(slug)),
    resize: () => dispatch(resize())
  });
