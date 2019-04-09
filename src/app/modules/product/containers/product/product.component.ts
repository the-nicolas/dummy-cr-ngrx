import { Component,OnInit, } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store,select } from '@ngrx/store';
import {
  ProductsState, LoadProducts,selectAllproducts,selectProductCategories, LoadSelectedProduct, selectCurrentProduct
} from '../../../../store';
import {selectTotalProductsInCart,getLoggedInUser,isUserAuthenticated} from '../../../../store'
import { CartComponent } from 'src/app/modules/cart/containers/cart/cart.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products:any;
  allProducts:any;
  activeProduct:any;
  totalProductsinCart:any;
  loggedInUser:any;
  isLoggedIn:any;

  constructor(public modalCtrl: ModalController,
              private store: Store<any>

             ) {
              // this.totalProductsinCart = this.store.pipe(select(selectTotalProductsInCart));
              // this.store.select(getLoggedInUser).subscribe(user =>{
              //   this.loggedInUser = user.email
              // })
              // this.store.select(isUserAuthenticated).subscribe(auth=>this.isLoggedIn=auth)
              }

  ngOnInit() {
    this.store.dispatch(new LoadProducts());
    this.store.dispatch(new LoadSelectedProduct());
    this.store.select(selectAllproducts).subscribe(allProducts =>{
      this.allProducts = allProducts;
    })
    this.store.select(selectProductCategories).subscribe(categories=>{
      this.products = categories
    })
    this.store.select(selectCurrentProduct).subscribe(currProduct =>{
      this.activeProduct = currProduct
    })

  }

  //  to be enabled to get cart modal
  public async openCart() {
    const cartModal = await this.modalCtrl.create({ component: CartComponent });
    return await cartModal.present();
  }

}
