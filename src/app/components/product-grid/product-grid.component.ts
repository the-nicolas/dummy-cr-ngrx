import { Component, Input } from '@angular/core';
import { Platform, PopoverController, Events } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { ProductOptionsPage } from '../../pages/product-options/product-options.page';
import { Products } from '../../data/products';

@Component({
  selector: 'products-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent {

  @Input('products') products: any = [];

  subProducts: any;
  activeItemIndex: any;
  perRow: number = 5;
  thisRow: number = 5;

  public constructor(public platform: Platform, public popoverCtrl: PopoverController, private events: Events, public cartService: CartService) {
  }

  public ionViewDidEnter() {

  }

  public async selectProduct(item: any, event) {
    if (item.isCategory) {
      this.loadProducts(item);
    } else if (item.options && item.options.length) {
      let optionsPopover = await this.popoverCtrl.create({
        component: ProductOptionsPage,
        componentProps: { product: item },
        event,
      });
      await optionsPopover.present();
      await optionsPopover.onDidDismiss().then((option) => {
        this.addToCart(item, option);
      });
    } else {
      this.addToCart(item);
    }
  }

  private loadProducts(item: any) {
    this.products.forEach(p => {
      if (p.id !== item.id) {
        p.showSubProducts = false;
      } else {
        p.showSubProducts = !item.showSubProducts;
      }
    });

    if (item.showSubProducts) {
      this.subProducts = Products.filter(p => p.categoryId === item.id);
      let i = this.products.indexOf(item);
      this.activeItemIndex = i > -1 ? i : null;
    } else {
      this.subProducts = null;
    }
  }

  public addSubGrid(index: number) {
    if ((index + 1) % this.perRow === 0) {
      this.thisRow = this.perRow;
      return true;
    } else if ((index + 1) === this.products.length) {
      this.thisRow = this.products.length % this.perRow;
      return true;
    }
    return false;
  }

  public addToCart(product: any, option: any = {}) {
    this.cartService.addItem(product, option).then(item => {
      this.events.publish('cart:item:added', item);
    });
  }
}
