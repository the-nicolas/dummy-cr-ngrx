import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { selectCartList } from '../selectors/cart.selectors';
import { withLatestFrom, tap ,map} from 'rxjs/operators';
import { ECartActions, ClearCart, NewInvoice } from '../actions/cart.actions';

@Injectable()
export class CartEffect {
  @Effect({ dispatch: false })
  saveCart = this.actions.pipe(
    ofType(ECartActions.ADD_PRODUCT, ECartActions.UPDATE_QUANTITY, ECartActions.CLEAR_CART),
    withLatestFrom(this.store.pipe(select(selectCartList))),
    tap(([actions, state]) => {
      sessionStorage.setItem('CART_ITEMS', JSON.stringify(state))
    })
  )

  @Effect()
  newInvoice = this.actions
    .pipe(
      ofType(ECartActions.NEW_INVOICE),
      map((x) => {
        return new ClearCart();      
     })
      )
    

  constructor(
    private actions: Actions,
    private store: Store<any>
  ) { }
}