import { PERFORMANCE_HEARTS_REQUEST } from 'actions/actionTypes';

export function performanceHeartsRequest(payload = {}) {
  return {
    type: PERFORMANCE_HEARTS_REQUEST,
    payload: payload
  };
}
