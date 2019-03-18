import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { CartState } from '../../store/state/cart.state';
import { selectTotalAmount, selectTotalProducts } from '../../store/selectors/cart.selector';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage {
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
    this.totalProducts = this.store.pipe(select(selectTotalProducts));
  }

  public closeMe() {
    this.modalCtrl.dismiss();
  }
}
