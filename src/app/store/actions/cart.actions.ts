import { Action } from '@ngrx/store';
import { Cart } from '../../models/cart.interface';

export enum CartActions {
  LOAD_CART = '[Cart] Load Cart',
  ADD_PRODUCT = '[Cart] Add Product',
  UPDATE_QUANTITY = '[Cart] Remove Product',
  CLEAR_CART = '[Cart] Clear Cart',
}

export class LoadCart implements Action {
  readonly type = CartActions.LOAD_CART;
}

export class AddProduct implements Action {
  readonly type = CartActions.ADD_PRODUCT;

  constructor(public payload: Cart) { }
}

export class UpdateProductQuantity implements Action {
  readonly type = CartActions.UPDATE_QUANTITY;

  constructor(
    public payload: number,
    // Default -1, means remove product itself from cart.
    // Any other number will just decrease quantity.
    public count: number = -1,
  ) { }
}

export class ClearCart implements Action {
  readonly type = CartActions.CLEAR_CART;

  constructor(public payload: number) { }
}

export type CartsActions = LoadCart | AddProduct | UpdateProductQuantity | ClearCart;