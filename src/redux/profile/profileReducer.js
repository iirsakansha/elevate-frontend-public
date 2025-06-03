import { ProfileActionTypes } from "./profileActionConstant";

const initState = {
  isProfileLoading: false,
  isProfileError: null,
  profile: null,
};

export const profile = (state = initState, action) => {
  switch (action.type) {
    case ProfileActionTypes.PROFILE_LOADING:
      return {
        ...state,
        isProfileLoading: true,
        isProfileError: null,
      };
    case ProfileActionTypes.PROFILE_SUCCESS:
      return {
        ...state,
        isProfileLoading: false,
        isProfileError: null,
        profile: action.profile,
      };
    case ProfileActionTypes.PROFILE_FAILED:
      return {
        ...state,
        isProfileLoading: false,
        isProfileError: action.err,
      };
    default:
      return state;
  }
};
