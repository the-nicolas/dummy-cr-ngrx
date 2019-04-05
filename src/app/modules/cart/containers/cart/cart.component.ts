import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
// import { InvoicePage } from '../invoice/invoice.page';
import { Store, select } from '@ngrx/store';
import { selectTotalAmount, selectTotalProducts } from '../../../../store/cart';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  totalProducts: Observable<any>;
  totalAmount: Observable<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private store: Store<any>) { 
      this.totalAmount = this.store.pipe(select(selectTotalAmount));
      this.totalProducts = this.store.pipe(select(selectTotalProducts));
    }

  ngOnInit() {
  }

  public async onCheckout() {
    // bring up invoice modal (incomplete)
  }

  public closeMe() {
    this.modalCtrl.dismiss();
  }

}
