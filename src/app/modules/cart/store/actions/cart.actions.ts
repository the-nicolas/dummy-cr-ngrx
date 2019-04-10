import { Action } from '@ngrx/store';
import { CartItem } from '../models/cart.interface';

export enum ECartActions {
  LOAD_CART = '[Cart] Load Cart',
  ADD_PRODUCT = '[Cart] Add Product',
  UPDATE_QUANTITY = '[Cart] Remove Product',
  CLEAR_CART = '[Cart] Clear Cart',
  NEW_INVOICE = '[Cart] New Invoice'
}

export class LoadCart implements Action {
  readonly type = ECartActions.LOAD_CART;
}

export class AddProduct implements Action {
  readonly type = ECartActions.ADD_PRODUCT;

  constructor(public payload: CartItem) { }
}

export class UpdateProductQuantity implements Action {
  readonly type = ECartActions.UPDATE_QUANTITY;

  constructor(
    public payload: number,
    // Default -1, means remove product itself from cart.
    // Any other number will just decrease quantity.
    public count: number = -1,
  ) { }
}

export class ClearCart implements Action {
  readonly type = ECartActions.CLEAR_CART;

  constructor(public payload?: number) { }
}

export class NewInvoice implements Action {
  readonly type = ECartActions.NEW_INVOICE;

}

export type CartActions = LoadCart | AddProduct | UpdateProductQuantity | ClearCart | NewInvoice;