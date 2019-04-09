import { switchMap,catchError, tap } from 'rxjs/operators';
import { map, mergeMap,withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromActions from '../actions';
import { ProductService } from '../services';
import {selectCurrentProductId} from '../selectors'
@Injectable()
export class ProductsEffect {
  constructor(
    private actions$: Actions,
    private router: Router,
    private productService: ProductService,
    private store: Store<any>
  ) {}

  @Effect()
  loadProducts$ = this.actions$
    .pipe(
      ofType(fromActions.LoadProductsActionTypes.LOAD_PRODUCTS),
      switchMap((action: fromActions.LoadProducts) => {
          return  this.productService.getAllProducts().pipe(
            map(res => {
              if (!res) {
                // this.router.navigate(['/dashboard']);
              }
              return new fromActions.LoadProductsSuccess(res);
            }),
            tap(res => {
            }),
            catchError(error => of(new fromActions.LoadProductsFail(error)))
          );
        })
      )

      @Effect({ dispatch: false })
      saveSelectedItem$ = this.actions$.pipe(
      ofType(fromActions.LoadProductsActionTypes.CLEAR_SELECTED_PRODUCT, fromActions.LoadProductsActionTypes.LOAD_SELECTED_PRODUCT, fromActions.LoadProductsActionTypes.UPDATE_SELECTED_PRODUCT),
      withLatestFrom(this.store.pipe(select(selectCurrentProductId))),
      tap(([actions, productId]) => {
      sessionStorage.setItem('SELECTED_ITEM', productId?productId.toString():'null')
    })
  )
      
}
