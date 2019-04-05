import { Component,OnInit, } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  ProductsState, LoadProducts,selectAllproducts,selectProductCategories, LoadSelectedProduct, selectCurrentProduct
} from '../../../../store/products';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products:any;
  allProducts:any;
  activeProduct:any;

  constructor(private productStore: Store<ProductsState>,
              public modalCtrl: ModalController
             ) { }

  ngOnInit() {
    this.productStore.dispatch(new LoadProducts());
    this.productStore.dispatch(new LoadSelectedProduct());
    this.productStore.select(selectAllproducts).subscribe(allProducts =>{
      this.allProducts = allProducts;
    })
    this.productStore.select(selectProductCategories).subscribe(categories=>{
      this.products = categories
    })
    this.productStore.select(selectCurrentProduct).subscribe(currProduct =>{
      this.activeProduct = currProduct
    })
  }

   //to be enabled to get cart modal
  // public async openCart() {
  //   const cartModal = await this.modalCtrl.create({ component: CartComponent });
  //   return await cartModal.present();
  // }

}
