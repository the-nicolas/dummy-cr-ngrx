import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { ProductOptionsPage } from '../../pages/product-options/product-options.page';
import { Products } from '../../data/products';
import { CartState } from '../../store/state/cart.state';
import { Store } from '@ngrx/store';
import { AddProduct } from '../../store/actions/cart.actions';

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

  constructor(
    public platform: Platform,
    public popoverCtrl: PopoverController,
    private ref: ChangeDetectorRef,
    private store: Store<CartState>,
  ) { }

  public ionViewDidEnter() { }

  public async selectProduct(item: any, event) {
    this.subProducts = null;
    this.ref.detectChanges();
    if (item.isCategory) {
      this.loseFocus(item, true);
      this.loadProducts(item);
    } else if (item.options && item.options.length) {
      const optionsPopover = await this.popoverCtrl.create({
        component: ProductOptionsPage,
        componentProps: { product: item },
        event,
      });
      optionsPopover.onDidDismiss().then(() => {
        this.addToCart(item);
      });
      await optionsPopover.present();
    } else {
      this.loseFocus(item);
      this.addToCart(item);
    }
  }

  private loadProducts(item: any) {
    if (!item.showSubProducts) {
      return;
    }
    this.subProducts = Products.filter(product => product.categoryId === item.id);
    let index = this.products.indexOf(item);
    this.activeItemIndex = index > -1 ? index : null;
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

  private loseFocus(item, isCategory = false) {
    this.products.forEach((product) => {
      if (product.id !== item.id || !isCategory) {
        return product.showSubProducts = false;
      }
      product.showSubProducts = !item.showSubProducts;
    });
  }

  public addToCart(product: any) {
    this.store.dispatch(new AddProduct(product));
  }

  ngOnDestroy() {
    this.products.forEach((product) => product.showSubProducts = false);
  }
}
