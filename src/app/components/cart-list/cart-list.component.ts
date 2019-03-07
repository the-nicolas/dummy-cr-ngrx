import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { Events } from '@ionic/angular';
import { CartService } from '../../services/cart.service';

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

  @Input('animate') animate: boolean = true;

  @Output() onCheckout = new EventEmitter<any>();

  cartList: any = [];
  totalAmount: number = 0;
  totalProducts: number = 0;

  constructor(
    private events: Events,
    // private storage: Storage,
    public cartService: CartService,
  ) {

    this.getCart();

    this.events.subscribe('cart:reload', (cart: any) => {
      this.getCart();
    });
    this.events.subscribe('cart:item:added', (item: any) => {
      let prod = this.cartList.find(p => p.id === item.id);
      if (prod) {
        prod.__count = item.__count;
      } else {
        this.cartList.push(item);
      }
    });
    this.events.subscribe('cart:item:removed', (item: any) => {
      let prod = this.cartList.find(p => p.id === item.id);
      if (prod) {
        prod.__count = item.__count;
        if (prod.__count <= 0) {
          this.cartList.splice(this.cartList.indexOf(prod), 1);
        }
      }
    });
  }

  /**
   * @name getCart
   * @description Load the products from storage, Calculate the total Amount and Number of Products
   */
  public getCart() {
    this.cartService.get().then(list => {
      this.cartList = list;
    });
  }

  /**
   * @name swipeProduct
   * @description When a product is swipe to left or right
   *  - Right swipe if direcrion is 4
   *  - Left swipe if direcrion is 2
   * @param {object} product swiped product
   * @param {event} event swipe event to determine is it left or right
   */
  public swipeProduct(product: any, event: any) {
    if (event.direction === 4) {
      this.cartService.addItem(product).then(item => {
        this.events.publish('cart:item:added', item);
      });
    } else if (event.direction === 2) {
      this.cartService.removeItem(product, 1).then(item => {
        this.events.publish('cart:item:removed', item);
      });
    }
  }
}
