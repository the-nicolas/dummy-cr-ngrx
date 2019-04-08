import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.component.html',
  styleUrls: ['./product-options.component.scss'],
})
export class ProductOptionsComponent {

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
