import { Action } from '@ngrx/store';

export enum LoadProductsActionTypes {
    LOAD_PRODUCTS = '[PRODUCTS] LOAD_PRODUCTS',
    LOAD_PRODUCTS_SUCCESS = '[PRODUCTS] LOAD_PRODUCTS_SUCCESS',
    LOAD_PRODUCTS_ERROR = '[PRODUCTS] LOAD_PRODUCTS_ERROR',
    RESET = '[PRODUCTS] RESET',
    LOAD_SELECTED_PRODUCT = '[PRODUCTS] Load Selected Product',
    UPDATE_SELECTED_PRODUCT = '[PRODUCTS] Update Selected Product',
    CLEAR_SELECTED_PRODUCT = '[PRODUCTS] Clear Selected Product'
  }

export class LoadProducts implements Action {
  readonly type = LoadProductsActionTypes.LOAD_PRODUCTS;
  constructor(public payload?: { categoryId: string}) {}
}

export class LoadProductsSuccess implements Action {
  readonly type =
    LoadProductsActionTypes.LOAD_PRODUCTS_SUCCESS;
  constructor(public payload?) {}
}
export class LoadProductsFail implements Action {
  readonly type =
    LoadProductsActionTypes.LOAD_PRODUCTS_ERROR;
  constructor(public payload?) {}
}
export class ResetProducts implements Action {
  readonly type = LoadProductsActionTypes.RESET;
  constructor(public payload?: any) {}
}

export class LoadSelectedProduct implements Action {
  readonly type = LoadProductsActionTypes.LOAD_SELECTED_PRODUCT;
}

export class UpdateSelectedProduct implements Action {
  readonly type = LoadProductsActionTypes.UPDATE_SELECTED_PRODUCT;

  constructor(public payload: number|null) { }
}

export class ClearSelectedProduct implements Action {
  readonly type = LoadProductsActionTypes.CLEAR_SELECTED_PRODUCT;
}

export type LoadProductsActions =
  | LoadProducts
  | LoadProductsSuccess
  | LoadProductsFail
  | ResetProducts
  | LoadSelectedProduct
  | UpdateSelectedProduct
  | ClearSelectedProduct
