import { Cart } from '../../models/cart.interface';

export interface CartState {
  cart: Cart[];
}

export const initialCartState = []