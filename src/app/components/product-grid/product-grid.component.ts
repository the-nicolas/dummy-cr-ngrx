import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Platform, PopoverController, Events } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { ProductOptionsPage } from '../../pages/product-options/product-options.page';
import { Products } from '../../data/products';

@Component({
  selector: 'products-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent implements OnDestroy {

  @Input('products') products: any = [];

  subProducts: any = null;
  activeItemIndex: any;
  perRow: number = 5;
  thisRow: number = 5;

  public constructor(
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public cartService: CartService,
    private events: Events,
    private ref: ChangeDetectorRef,
  ) { }

  public ionViewDidEnter() { }

  public async selectProduct(item: any, event) {
    this.subProducts = null;
    this.ref.detectChanges();
    if (item.isCategory) {
      this.loadProducts(item);
    } else if (item.options && item.options.length) {
      const optionsPopover = await this.popoverCtrl.create({
        component: ProductOptionsPage,
        componentProps: { product: item },
        event,
      });
      optionsPopover.onDidDismiss().then((option) => {
        this.addToCart(item, option);
      });
      await optionsPopover.present();
    } else {
      this.addToCart(item);
    }
  }

  private loadProducts(item: any) {
    this.products.forEach(product => {
      if (product.id !== item.id) {
        product.showSubProducts = false;
      } else {
        product.showSubProducts = !item.showSubProducts;
      }
    });

    if (item.showSubProducts) {
      this.subProducts = Products.filter(product => product.categoryId === item.id);
      let index = this.products.indexOf(item);
      this.activeItemIndex = index > -1 ? index : null;
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

  ngOnDestroy() {
    this.products.forEach(product => product.showSubProducts = false);
  }
}
