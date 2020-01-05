import {
  SHOW_NOTIFICATION,
  REMOVE_NOTIFICATION,
  SHOW_GLOBAL_NOTIFICATION,
  REMOVE_GLOBAL_NOTIFICATION
} from 'constants/ActionTypes';
import NotificationsActive from '@material-ui/icons/NotificationsActive';

const initialNotificationState = {
  notification: {
    show: false,
    onShow: () => '',
    color: 'danger',
    icon: NotificationsActive
  }
};
const initialGlobalNotificationState = {
  globalNotification: {
    show: false,
    onShow: () => '',
    color: 'danger'
  }
};

const initialState = {
  ...initialNotificationState,
  ...initialGlobalNotificationState
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        notification: {
          onShow: action.onShow,
          color: action.color,
          icon: action.icon,
          show: true
        }
      };
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notification: {
          ...state.notification,
          show: false
        }
      };
    case SHOW_GLOBAL_NOTIFICATION:
      return {
        ...state,
        globalNotification: {
          ...state.globalNotification,
          onShow: action.onShow,
          color: action.color,
          show: true
        }
      };

    case REMOVE_GLOBAL_NOTIFICATION:
      return {
        ...state,
        globalNotification: {
          ...state.globalNotification,
          show: false
        }
      };
    default:
      return state;
  }
}
