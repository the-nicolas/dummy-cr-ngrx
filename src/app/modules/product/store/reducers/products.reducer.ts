import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import Product from '../models/product.model';
import {
    LoadProductsActions,
    LoadProductsActionTypes
  } from '../actions/products.actions';

export interface ProductsState
  extends EntityState<Product> {
    selectedProductId: number | null;
    loading:Boolean
}



const adapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: product => product.id,
  sortComparer: false
});
const initialState: ProductsState = adapter.getInitialState({
  selectedProductId: null,
  loading:false
});

export function ProductsReducer(
    state = initialState,
    action: LoadProductsActions
  ): ProductsState {
    switch (action.type) {
      case LoadProductsActionTypes.LOAD_PRODUCTS: {
        return {
          ...adapter.removeAll(state),
          loading: true
        };
      }
      case LoadProductsActionTypes.LOAD_PRODUCTS_SUCCESS: {
        return {
          ...adapter.addAll(action.payload, state),
          loading: false
        };
      }
  
      case LoadProductsActionTypes.LOAD_PRODUCTS_ERROR: {
        return {
          ...state,
          loading: false
        };
      }

      case LoadProductsActionTypes.RESET: {
        return initialState;
      }

      case LoadProductsActionTypes.LOAD_SELECTED_PRODUCT:{
         if(JSON.parse(sessionStorage.getItem('SELECTED_ITEM'))) {
           return {...state,
                   selectedProductId:JSON.parse(sessionStorage.getItem('SELECTED_ITEM'))
           };
         }
         else{
          return state
         }         
         
      }

      case LoadProductsActionTypes.CLEAR_SELECTED_PRODUCT:{
        return {...state,
                selectedProductId:null
        };
      }

      case LoadProductsActionTypes.UPDATE_SELECTED_PRODUCT: {
        if(action.payload){
          return {...state,
                  selectedProductId:action.payload
                }
        }
        else{
          return state
        }
    }

      default: {
        return state;
      }
    }
  }

  export const getSelectedProductId = (state: ProductsState) => state.selectedProductId;

  export const {
    // select the array of Product ids
    selectIds,
  
    // select the dictionary of Product entities
    selectEntities,
  
    // select the array of Products
    selectAll,
  
    // select the total Products count
    selectTotal
  } = adapter.getSelectors();

 export const selectProductsIds = selectIds;
 export const selectProductsEntities = selectEntities;
 export const selectProductsMembers = selectAll;
 export const selectProductsTotal = selectTotal;