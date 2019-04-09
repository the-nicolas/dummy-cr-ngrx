import { Component, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { Store, select } from '@ngrx/store';
import { CartState } from '../../../../store';
import { selectCartList } from '../../../../store';
import { UpdateProductQuantity, AddProduct } from '../../../../store';

@Component({
  selector: 'cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
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
export class CartItemComponent {
  cartListStore;
  cartList: any = [];

  @Input('animate') animate: boolean = true;
  cartValue: any;

  constructor(
    private store: Store<CartState>
  ) {
    this.cartListStore = this.store.pipe(select(selectCartList));
  }

  addProduct(cart) {
    this.store.dispatch(new AddProduct(cart));
  }

  updateQuantity(cart, count?: number) {
    this.store.dispatch(new UpdateProductQuantity(cart.id, count));
  }
}
