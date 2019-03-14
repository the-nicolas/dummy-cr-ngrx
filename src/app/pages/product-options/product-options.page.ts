import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.page.html',
  styleUrls: ['./product-options.page.scss'],
})
export class ProductOptionsPage {

  product: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController
  ) {
    this.product = this.navParams.get('product');
  }

  ionViewDidEnter() { }

  public selectOption(option) {
    this.popoverCtrl.dismiss(option);
  }
}
