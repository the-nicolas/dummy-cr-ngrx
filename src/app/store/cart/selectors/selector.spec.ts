import { CartState } from "../cart.state";
import { CartItem } from '../../models/cart.interface';
import { selectTotalAmount } from '.';


describe('Login Selector', () => {
    it('selectTotalAmount', () => {
        expect(selectTotalAmount({count:1})).toBe(0);
    });
});