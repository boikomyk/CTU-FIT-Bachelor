/**
 * @param {String} email
 * @return {Object}
 */
export const verifyEmail = email => {
  let emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRex.test(email);
};

/**
 * @param {String} string
 * @param {int} length
 * @return {Object}
 */
export const verifyLength = (string, length) => {
  return string.length >= length;
};
