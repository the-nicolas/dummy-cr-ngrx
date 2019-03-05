import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { InvoicePage } from '../invoice/invoice.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {

  constructor(
    public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {

  }

  public async onCheckout() {
    let invoiceModal = await this.modalCtrl.create({
      component: InvoicePage,
      cssClass: 'invoice-modal',
      showBackdrop: false,
    });
    await invoiceModal.present();
  }

  public closeMe() {
    this.navCtrl.pop();
  }
}
