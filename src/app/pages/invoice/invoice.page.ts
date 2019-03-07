import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, ModalController } from '@ionic/angular';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage {

  cart: any;
  totalAmount: number = 0;
  totalProducts: number = 0;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private storage: Storage
  ) { }

  ionViewWillEnter() {
    this.getCart();
  }


  /**
  * @name getCart
  * @description Load the products from storage, Calculate the total Amount and Number of Products
  */
  public getCart() {
    this.storage.get('cart').then(cart => {
      this.cart = cart || [];

      this.totalAmount = 0;
      this.totalProducts = 0;
      this.cart.forEach(p => {
        this.totalProducts += p.__count;
        this.totalAmount += (p.__count * p.price);
      });
    });
  }

  public closeMe() {
    this.modalCtrl.dismiss();
  }
}
