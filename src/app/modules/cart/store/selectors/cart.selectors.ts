import { CartState } from '../reducers';

export const selectCartList = (state: CartState) => state.cart;

export const selectTotalAmount = (state) => {
  if (!state || !state.cart || !state.cart.length) {
    return 0;
  }

  return state.cart.reduce((agg, item) => {
    return agg += item.count * item.price;
  }, 0);
}

export const selectTotalProductsInCart = (state) => {
  if (!state || !state.cart || !state.cart.length) {
    return 0;
  }

  return state.cart.reduce((agg, item) => {
    return agg += item.count;
  }, 0);
}