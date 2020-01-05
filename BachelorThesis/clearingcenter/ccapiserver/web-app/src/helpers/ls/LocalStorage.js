/**
 * @param {String} token
 */
export function setAccessToken(token) {
  localStorage.setItem('x-xsrf-token', token);
}

/**
 * @return {boolean}
 */
export function isAccessTokenSet() {
  let token = localStorage.getItem('x-xsrf-token');
  return !!token;
}

/**
 * @return {Object}
 */
export function getAccessTokenHeader() {
  let token = localStorage.getItem('x-xsrf-token');

  if (token) {
    return {'x-xsrf-token': token};
  } else {
    return {};
  }
}

/**
 * @return {Object}
 */
export function getAccessToken() {
  let token = localStorage.getItem('x-xsrf-token');

  if (token) {
    return token;
  } else {
    return {};
  }
}

export function removeAccessToken() {
  localStorage.removeItem('x-xsrf-token');
}
