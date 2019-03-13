import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, ModalController } from '@ionic/angular';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage {

  cartList: any;
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
      this.cartList = cart || [];

      this.totalAmount = 0;
      this.totalProducts = 0;
      this.cartList.forEach(cart => {
        this.totalProducts += cart.__count;
        this.totalAmount += (cart.__count * cart.price);
      });
    });
  }

  public closeMe() {
    this.modalCtrl.dismiss();
  }
}
