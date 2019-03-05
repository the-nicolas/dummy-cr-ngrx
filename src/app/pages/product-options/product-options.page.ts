import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { ViewController } from '@ionic/core';

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.page.html',
  styleUrls: ['./product-options.page.scss'],
})
export class ProductOptionsPage {

  product: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.product = this.navParams.get('product');
  }

  ionViewDidEnter() {

  }

  public selectOption(option) {
    this.modalCtrl.dismiss(option);
  }
}
