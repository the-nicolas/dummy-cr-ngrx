import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { CartState } from '../../../../store';
import { selectTotalAmount, selectTotalProductsInCart } from '../../../../store';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  cartList: any;
  totalAmount: any;
  totalProducts: any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private store: Store<CartState>
  ) { }

  ngOnInit() {
    this.totalAmount = this.store.pipe(select(selectTotalAmount));
    this.totalProducts = this.store.pipe(select(selectTotalProductsInCart));
  }

  public closeMe() {
    this.modalCtrl.dismiss();
  }
}
