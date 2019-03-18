import { initialCartState } from '../state/cart.state'
import { CartsActions, CartActions } from '../actions/cart.actions';

export function cartReducer(
  state = initialCartState,
  action: CartsActions,
) {
  switch (action.type) {
    case CartActions.GET_CARTS:
      if (JSON.parse(sessionStorage.getItem('CART_LIST'))) {
        state = JSON.parse(sessionStorage.getItem('CART_LIST'));
      }
      return state;

    case CartActions.REMOVE_CARTS:
      state = initialCartState;
      return state;

    case CartActions.ADD_CART: {
      const itemIndex = state.findIndex((item) => item.id === action.payload.id);
      if (itemIndex === -1) {
        Object.assign(action.payload, { count: 1 });
        state.push(action.payload);
        return state;
      }
      state[itemIndex].count += 1;
      return state;
    }

    case CartActions.REMOVE_CART: {
      const itemIndex = state.findIndex((item) => item.id === action.payload);
      if (itemIndex === -1) {
        return state;
      }
      if (state[itemIndex].count > 1) {
        state[itemIndex].count -= 1;
        return state;
      }
      state.splice(itemIndex, 1);
      return state;
    }

    case CartActions.REMOVE_ONE_CART: {
      const itemIndex = state.findIndex((item) => item.id === action.payload);
      state.splice(itemIndex, 1);
      return state;
    }

    default:
      return state;
  }
}