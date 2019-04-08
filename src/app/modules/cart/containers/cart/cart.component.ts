import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { InvoiceComponent} from '../../components/invoice/invoice.component'

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
    let invoiceModal = await this.modalCtrl.create({
      component: InvoiceComponent,
      cssClass: 'invoice-modal',
      showBackdrop: false,
    });
    await invoiceModal.present();
  }

  public closeMe() {
    this.modalCtrl.dismiss();
  }

}
