import { User } from '../../models/user.model';
import { AuthenticationActionTypes, AuthenticationActions } from '../actions';
 
export interface State {
  isAuthenticated: boolean;
  user: User | null;
  errorMessage: string | null;
}
 
//set the initial state with localStorage
export const initialState: State = {
  isAuthenticated: localStorage.getItem('token')!==null,
  user: {
          token: localStorage.getItem('token'),
          email: localStorage.getItem('email')
        },
  errorMessage: null
};
 
export function AuthenticationReducer(state = initialState, action: AuthenticationActions): State {
  switch (action.type) {
    case AuthenticationActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: {
          token: action.payload.token,
          email: action.payload.email
        },
        errorMessage: null
      };
    }
    case AuthenticationActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Wrong credentials.'
      };
    }
    case AuthenticationActionTypes.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}