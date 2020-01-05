import { SHOW_ALERT, REMOVE_ALERT } from 'constants/ActionTypes';

const initialState = {
  title: '',
  message: '',
  color: 'success',
  show: false,
  onConfirm: () => {}
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        ...state,
        title: action.title,
        message: action.message,
        color: action.color,
        show: true,
        onConfirm: action.onConfirm
      };
    case REMOVE_ALERT:
      return {
        ...state,
        title: '',
        message: '',
        alert: '',
        show: false,
        onConfirm: () => {}
      };
    default:
      return state;
  }
}
