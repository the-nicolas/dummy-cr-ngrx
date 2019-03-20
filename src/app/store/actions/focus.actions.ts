import { Action } from '@ngrx/store';
import { FocusItem } from '../../models/focus.interface';

export enum EFocusActions {
  LOAD_FOCUS = '[Grid] Load Focus',
  UPDATE_FOCUS = '[Grid] Update Focus',
  CLEAR_FOCUS = '[Grid] Clear Focus',
}

export class LoadFocus implements Action {
  readonly type = EFocusActions.LOAD_FOCUS;
}

export class UpdateFocus implements Action {
  readonly type = EFocusActions.UPDATE_FOCUS;

  constructor(public payload: FocusItem) { }
}

export class ClearFocus implements Action {
  readonly type = EFocusActions.CLEAR_FOCUS;
}

export type FocusActions = LoadFocus | UpdateFocus | ClearFocus;