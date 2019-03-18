import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { InvoicePage } from '../invoice/invoice.page';
import { Store, select } from '@ngrx/store';
import { selectTotalAmount, selectTotalProducts } from '../../store/selectors/cart.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {
  totalProducts: Observable<any>;
  totalAmount: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private store: Store<any>
  ) {
    this.totalAmount = this.store.pipe(select(selectTotalAmount));
    this.totalProducts = this.store.pipe(select(selectTotalProducts));
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
}
