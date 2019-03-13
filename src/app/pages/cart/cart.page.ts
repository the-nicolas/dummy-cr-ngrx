import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from '@ionic/angular';
import { InvoicePage } from '../invoice/invoice.page';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {
  totalProducts: number = 0;
  totalAmount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private cartService: CartService,
    private events: Events,
  ) {
    this.getCartValue();

    this.events.subscribe('cart:reload', (cart: any) => {
      this.getCartValue();
    });
    this.events.subscribe('cart:item:added', (item: any) => {
      this.getCartValue();
    });
    this.events.subscribe('cart:item:removed', (item: any) => {
      this.getCartValue();
    });
  }

  ionViewDidLoad() { }

  public async onCheckout() {
    let invoiceModal = await this.modalCtrl.create({
      component: InvoicePage,
      cssClass: 'invoice-modal',
      showBackdrop: false,
    });
    await invoiceModal.present();
  }

  public closeMe() {
    this.modalCtrl.dismiss();
  }

  public getCartValue() {
    this.cartService.getValue().then((value: any) => {
      this.totalProducts = value.totalProducts;
      this.totalAmount = value.totalAmount;
    });
  }
}
