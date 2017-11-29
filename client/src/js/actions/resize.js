import { RESIZE } from 'actions/actionTypes';

export function resize(payload = {}) {
  return {
    type: RESIZE
  };
}
