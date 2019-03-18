import { Component, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { Store, select } from '@ngrx/store';
import { CartState } from '../../store/state/cart.state';
import { selectCartList } from '../../store/selectors/cart.selector';
import { RemoveCart, AddCart, RemoveOneCart } from '../../store/actions/cart.actions';

@Component({
  selector: 'cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
  animations: [
    trigger('cart', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
          animate('0.5s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 }),
          ]))
        ]), { optional: true }),
        query(':leave', stagger('300ms', [
          animate('0.3s ease-out', keyframes([
            style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
            style({ opacity: 0, transform: 'translateX(-100%)', offset: 1.0 }),
          ]))
        ]), { optional: true })
      ])
    ])
  ]
})
export class CartListComponent {
  cartListStore;
  cartList: any = [];

  @Input('animate') animate: boolean = true;
  cartValue: any;

  constructor(
    public cartService: CartService,
    private store: Store<CartState>
  ) {
    this.cartListStore = this.store.pipe(select(selectCartList));
  }

  addProduct(cart) {
    this.store.dispatch(new AddCart(cart));
  }

  removeCart(cart) {
    this.store.dispatch(new RemoveCart(cart.id));
  }

  removeAllCart(cart) {
    this.store.dispatch(new RemoveOneCart(cart.id));
  }
}
