import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap,
  } from '@ngrx/store';
  import * as fromReducer from '../reducers/products.reducer';

  export interface State {
    users: fromReducer.ProductsState;
  }  

  export const selectProductState = createFeatureSelector<fromReducer.ProductsState>('products');

  export const selectproductsIds = createSelector(
    selectProductState,
    fromReducer.selectProductsIds
  );

  export const selectProductEntities = createSelector(
    selectProductState,
    fromReducer.selectProductsEntities
  );
  export const selectAllproducts = createSelector(
    selectProductState,
    fromReducer.selectProductsMembers
  );
  export const selectTotalProducts = createSelector(
    selectProductState,
    fromReducer.selectProductsTotal
  );

  export const selectCurrentProductId = createSelector(
    selectProductState,
    fromReducer.getSelectedProductId
  );

  export const selectCurrentProduct = createSelector(
    selectProductEntities,
    selectCurrentProductId,
    (productEntities, productId) => productEntities[productId]
  );

  export const selectProductCategories = createSelector(
    selectAllproducts,
    (Products) => Products.filter(product=>product.categoryId===null)
  );

