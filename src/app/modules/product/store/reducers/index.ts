import { ActionReducerMap } from '@ngrx/store';

import * as productsReducer from './products.reducer';
export * from './products.reducer';

export interface AllProductsState {
 productsReducer: productsReducer.ProductsState;
}

export const AllMembersReducer: ActionReducerMap<AllProductsState> = {
  productsReducer: productsReducer.ProductsReducer
};