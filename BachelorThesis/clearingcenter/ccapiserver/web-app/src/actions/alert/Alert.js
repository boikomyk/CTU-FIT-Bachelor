import { REMOVE_ALERT, SHOW_ALERT } from 'constants/ActionTypes';

/**
 * @param {String} title
 * @param {Object} message
 * @param {String} color
 * @param {Function} onConfirm
 * @return {Object}
 */

export function pushAlert(title, message, color, onConfirm) {
  return {
    type: SHOW_ALERT,
    title: title,
    message: message,
    color: color,
    onConfirm: onConfirm
  };
}

/**
 * @return {Object}
 */
export function removeAlert() {
  return {
    type: REMOVE_ALERT
  };
}
