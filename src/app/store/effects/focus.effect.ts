import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { withLatestFrom, tap } from 'rxjs/operators';
import { EFocusActions } from '../actions/focus.actions';
import { SelectFocusList } from '../selectors/focus.selector';

@Injectable()
export class FocusEffect {
  @Effect({ dispatch: false })
  saveFocus = this.actions.pipe(
    ofType(EFocusActions.CLEAR_FOCUS, EFocusActions.LOAD_FOCUS, EFocusActions.UPDATE_FOCUS),
    withLatestFrom(this.store.pipe(select(SelectFocusList))),
    tap(([actions, state]) => {
      sessionStorage.setItem('FOCUS', JSON.stringify(state))
    })
  )

  constructor(
    private actions: Actions,
    private store: Store<any>
  ) { }
}