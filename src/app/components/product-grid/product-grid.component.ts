import { FocusState } from './../../store/state/focus.state';
import { CartItem } from './../../models/cart.interface';
import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { ProductOptionsPage } from '../../pages/product-options/product-options.page';
import { Products } from '../../data/products';
import { CartState } from '../../store/state/cart.state';
import { Store } from '@ngrx/store';
import { AddProduct } from '../../store/actions/cart.actions';
import { UpdateFocus } from '../../store/actions/focus.actions';

@Component({
  selector: 'products-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent implements OnDestroy {
  @Input('products') products: any = [];

  subProducts: any = null;
  activeItemIndex: number;
  perRow: number = 5;
  thisRow: number = 5;
  isActive: boolean;
  activeItem: CartItem;
  foundIndex: number;

  @Input()
  set active(active: CartItem) {
    const foundIndex = this.findActive(active);
    this.activeItem = active;
    this.activeItemIndex = foundIndex !== -1 ? foundIndex : this.findActiveInChilds(active);
    const target = this.products[this.activeItemIndex];
    if (target) {
      target.showSubProducts = true;
      this.loadProducts(target, false);
    }
  }

  constructor(
    public platform: Platform,
    public popoverCtrl: PopoverController,
    private ref: ChangeDetectorRef,
    private cartStore: Store<CartState>,
    private focusStore: Store<FocusState>,
  ) { }

  public ionViewDidEnter() { }

  public async selectProduct(item: any, event) {
    this.subProducts = null;
    this.ref.detectChanges();
    if (item.isCategory) {
      this.loseFocus(item, true);
      this.loadProducts(item);
      return;
    }
    if (!item.options || !item.options.length) {
      this.loseFocus(item);
      this.addToCart(item);
      return;
    }
    const optionsPopover = await this.popoverCtrl.create({
      component: ProductOptionsPage,
      componentProps: { product: item },
      event,
    });
    optionsPopover.onDidDismiss().then(() => {
      this.addToCart(item);
    });
    await optionsPopover.present();
  }

  private findActive(activeItem: CartItem) {
    if (!activeItem) {
      return -1;
    }
    return this.products.findIndex((item: CartItem) => item.id === activeItem.id);
  }

  /**
   * Find if activeItem exists in child and returns index if so.
   */
  private findActiveInChilds(activeItem: CartItem, target = this.products) {
    if (!activeItem) {
      return -1;
    }
    // Return flattened array of all the elements. Easier to find if one i need exists.
    const flatten = (arr: CartItem[]) => {
      return arr.reduce((agg, item) => {
        const subproducts = Products.filter(product => product.categoryId === item.id);
        return [...agg, item, ...flatten(subproducts)];
      }, []);
    };
    // Searching for target in whole flattened array.
    return target.findIndex((item) => {
      if (item.id === activeItem.id) {
        return true;
      }
      return flatten([item]).find((item) => item.id === activeItem.id);
    });
  }

  private loadProducts(item: any, emitFocus = true) {
    if (!item || !item.showSubProducts) {
      return;
    }
    this.subProducts = Products.filter(product => product.categoryId === item.id);
    let index = this.products.indexOf(item);
    this.activeItemIndex = index !== -1 ? index : null;
    if (emitFocus) {
      this.focusStore.dispatch(new UpdateFocus(item));
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

  private loseFocus(item, isCategory = false) {
    this.products.forEach((product) => {
      if (product.id !== item.id || !isCategory) {
        return product.showSubProducts = false;
      }
      product.showSubProducts = !item.showSubProducts;
    });
  }

  public addToCart(product: any) {
    this.cartStore.dispatch(new AddProduct(product));
  }

  ngOnDestroy() {
    this.products.forEach((product) => product.showSubProducts = false);
  }
}
