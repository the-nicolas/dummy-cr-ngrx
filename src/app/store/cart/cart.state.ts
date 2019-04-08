import { CartItem } from '../models/cart.interface';

export interface CartState {
  cart: CartItem[];
}

export const initialCartState = []