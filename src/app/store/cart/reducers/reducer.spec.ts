import { initialCartState } from "../cart.state";
import { CartReducer } from '.';



describe('Cart Reducer', () => {
    const user = {
        username: 'Anakin',
        password: 'Skywalker'
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            // arrange

            // act
            const action = { type: 'NOOP' } as any;
            const result = CartReducer(initialCartState, action);
            // assert
            expect(result).toBe(initialCartState);
        });
    });

    describe('Remove Product', () => {
        it('should return the default state', () => {
            // arrange

            // act
            const action = { type: '[Cart] Remove Product' } as any;
            const result = CartReducer(initialCartState, action);
            // assert
            expect(result).toBe(initialCartState);
        });
    });


});