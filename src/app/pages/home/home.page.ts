import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, Events } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { Products } from '../../data/products';
import { CartPage } from '../cart/cart.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  products: any;
  totalProducts: number = 0;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public cart: CartService,
    private events: Events
  ) {
    this.products = Products.filter(product => product.categoryId === null);

    this.setProductsCount();
    this.events.subscribe('cart:reload', (cart) => {
      this.setProductsCount();
    });
    this.events.subscribe('cart:item:added', (item) => {
      this.setProductsCount();
    });
    this.events.subscribe('cart:item:removed', (item) => {
      this.setProductsCount();
    });
  }

  public async openCart() {
    const cartModal = await this.modalCtrl.create({ component: CartPage });
    return await cartModal.present();
    //this.navCtrl.push(CartPage);
  }

  setProductsCount() {
    this.cart.count().then((count: any) => {
      this.totalProducts = count;
    });
  }
}
