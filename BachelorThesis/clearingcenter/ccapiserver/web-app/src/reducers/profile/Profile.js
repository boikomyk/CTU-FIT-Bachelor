import { SET_PROFILE, PROFILE_LOADED } from 'constants/ActionTypes';
import Profile from 'models/Profile';

const initialState = {
  profile: new Profile(),
  loaded: false,
  avatarColor: '#9c27b0'
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile,
        avatarColor: action.avatarColor,
        loaded: false
      };

    case PROFILE_LOADED:
      return {
        ...state,
        loaded: action.loaded
      };

    default:
      return state;
  }
}
