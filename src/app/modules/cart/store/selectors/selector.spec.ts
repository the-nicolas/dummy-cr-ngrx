import { CartState } from "../cart.state";
import { CartItem } from '../../models/cart.interface';
import { selectTotalAmount } from '.';


describe('Cart Selector', () => {
    it('selectTotalAmount', () => {
        expect(selectTotalAmount({count:1})).toBe(0);
    });
});