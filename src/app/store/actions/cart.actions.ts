import { Action } from '@ngrx/store';
import { Cart } from '../../models/cart.interface';

export enum CartActions {
  GET_CARTS = '[Cart] Get Carts',
  REMOVE_CARTS = '[Cart] Remove Carts',
  ADD_CART = '[Cart] Add Cart',
  REMOVE_CART = '[Cart] Remove Cart',
  REMOVE_ONE_CART = '[Cart] Remove One Cart'
}

export class GetCarts implements Action {
  readonly type = CartActions.GET_CARTS;
}

export class RemoveCarts implements Action {
  readonly type = CartActions.REMOVE_CARTS;
}

export class AddCart implements Action {
  readonly type = CartActions.ADD_CART;

  constructor(public payload: Cart) { }
}

export class RemoveCart implements Action {
  readonly type = CartActions.REMOVE_CART;

  constructor(public payload: number) { }
}

export class RemoveOneCart implements Action {
  readonly type = CartActions.REMOVE_ONE_CART;

  constructor(public payload: number) { }
}

export type CartsActions = GetCarts | RemoveCarts | AddCart | RemoveCart | RemoveOneCart;