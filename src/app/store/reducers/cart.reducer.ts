import { initialCartState } from '../state/cart.state'
import { CartsActions, CartActions } from '../actions/cart.actions';

export function CartReducer(
  state = initialCartState,
  action: CartsActions,
) {
  switch (action.type) {
    case CartActions.LOAD_CART:
      return JSON.parse(sessionStorage.getItem('CART_ITEMS')) || state;

    case CartActions.CLEAR_CART:
      return initialCartState;

    case CartActions.ADD_PRODUCT: {
      const itemIndex = state.findIndex((item) => item.id === action.payload.id);
      // New item, just add it to the end of cart.
      if (itemIndex === -1) {
        return [...state, Object.assign({}, action.payload, { count: 1 })];
      }
      // Increment count
      state[itemIndex].count += 1;
      return state;
    }

    case CartActions.UPDATE_QUANTITY: {
      const itemIndex = state.findIndex((item) => item.id === action.payload);
      if (itemIndex === -1) {
        return state;
      }
      state[itemIndex].count -= action.count;
      // If count less than 1, should remove item itself.
      if (action.count === -1 || state[itemIndex].count < 1) {
        state.splice(itemIndex, 1);
      }
      return state;
    }

    default:
      return state;
  }
}