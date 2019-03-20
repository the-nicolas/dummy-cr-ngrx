import { FocusActions, EFocusActions } from './../actions/focus.actions';
import { initialFocusState } from '../state/focus.state';

export function FocusReducer(
  state = initialFocusState,
  action: FocusActions,
) {
  switch (action.type) {
    case EFocusActions.LOAD_FOCUS:
      return JSON.parse(sessionStorage.getItem('FOCUS')) || state;

    case EFocusActions.CLEAR_FOCUS:
      return initialFocusState;

    case EFocusActions.UPDATE_FOCUS: {
      return action.payload || state;
    }

    default:
      return state;
  }
}