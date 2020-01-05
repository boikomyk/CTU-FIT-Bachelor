import _profile from 'resources/rest/Profile';

import { SET_PROFILE, PROFILE_LOADED } from 'constants/ActionTypes';
import Profile from 'models/Profile';

/**
 * @param {Object} profile
 * @return {Object}
 */
export function setProfile(profile) {
  return {
    type: SET_PROFILE,
    profile,
    avatarColor: _.sample([
      '#9c27b0',
      '#c90040',
      '#2cffc0',
      '#17216a',
      '#00acc1',
      '#5364b7',
      '#ff5ccb'
    ])
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function profileLoaded(loaded) {
  return {
    type: PROFILE_LOADED,
    loaded
  };
}

/**
 * @return {Promise}
 */
export const getProfile = () => dispatch => {
  dispatch(profileLoaded(false));
  return _profile()
    .then(response => {
      dispatch(setProfile(Profile.fromJSON(response.data)));
      dispatch(profileLoaded(true));
    })
    .catch(() => {});
};
