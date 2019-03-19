import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Products } from '../../data/products';
import { CartPage } from '../cart/cart.page';
import { Store, select } from '@ngrx/store';
import { selectTotalProducts } from '../../store/selectors/cart.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  products: any;
  totalProducts: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private store: Store<any>,
  ) {
    this.products = Products.filter(product => product.categoryId === null);
    this.totalProducts = this.store.pipe(select(selectTotalProducts));
  }

  public async openCart() {
    const cartModal = await this.modalCtrl.create({ component: CartPage });
    return await cartModal.present();
  }
}
