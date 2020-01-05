import {
  REMOVE_GLOBAL_NOTIFICATION,
  REMOVE_NOTIFICATION,
  SHOW_GLOBAL_NOTIFICATION,
  SHOW_NOTIFICATION
} from 'constants/ActionTypes';

/**
 * @param {Object} message
 * @param {String} color
 * @param {Object} icon
 * @return {Object}

 */
export function pushNotification(message, color, icon) {
  const onShow = () => {
    return message;
  };
  return {
    type: SHOW_NOTIFICATION,
    onShow,
    color,
    icon
  };
}

/**
 * @param {Object} message
 * @param {String} color
 * @return {Object}

 */
export function setGlobalNotification(message, color) {
  const onShow = () => {
    return message;
  };
  return {
    type: SHOW_GLOBAL_NOTIFICATION,
    onShow,
    color
  };
}

/**
 * @return {Object}
 */
export function removeGlobalNotification() {
  return {
    type: REMOVE_GLOBAL_NOTIFICATION
  };
}

/**
 * @return {Object}
 */
export function removeNotification() {
  return {
    type: REMOVE_NOTIFICATION
  };
}
