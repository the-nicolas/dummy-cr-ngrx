import { Component, Input, ChangeDetectorRef, OnDestroy,OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CartItem } from '../../../../store/models/cart.interface';
import { CartState } from '../../../../store/cart/cart.state';
import { Store } from '@ngrx/store';
import {
  ProductsState, selectAllproducts, UpdateSelectedProduct
} from '../../../../store/products';

import {AddProduct} from '../../../../store/cart';

@Component({
  selector: 'product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})

export class ProductGridComponent implements OnInit,OnDestroy {
  @Input('products') products: any = [];

  subProducts: any = null;
  activeItemIndex: number;
  perRow: number = 5;
  thisRow: number = 5;
  isActive: boolean;
  activeItem: CartItem;
  foundIndex: number;
  Products:any;

  @Input()
  set active(active: CartItem) {
    this.productStore.select(selectAllproducts).subscribe(allProducts =>{
      this.Products = allProducts;
    })
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
    // public popoverCtrl: PopoverController,
    private ref: ChangeDetectorRef,
    private cartStore: Store<CartState>,
    // private focusStore: Store<FocusState>,
    private productStore: Store<ProductsState>
  ) { }
  

  public ionViewDidEnter() { }

  ngOnInit(){
    console.log('grid oninit')
    //products once retrieved during the main container init, now retrieving from store on init
    this.productStore.select(selectAllproducts).subscribe(allProducts =>{
      this.Products = allProducts;
      console.log(allProducts)
    })
}


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
    // const optionsPopover = await this.popoverCtrl.create({
    //   component: ProductOptionsPage,
    //   componentProps: { product: item },
    //   event,
    // });
    // optionsPopover.onDidDismiss().then(() => {
    //   this.addToCart(item);
    // });
    // await optionsPopover.present();
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
        const subproducts = this.Products.filter(product => product.categoryId === item.id);
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
    this.subProducts = this.Products.filter(product => product.categoryId === item.id);
    let index = this.products.indexOf(item);
    this.activeItemIndex = index !== -1 ? index : null;
    if (emitFocus) {
       this.productStore.dispatch(new UpdateSelectedProduct(item.id));
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
