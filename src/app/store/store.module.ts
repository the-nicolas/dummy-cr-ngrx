import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

<<<<<<< HEAD
import {ProductsReducer,PRODUCTS_EFFECTS,PRODUCT_SERVICES} from './products'
import {CartReducer,CART_EFFECTS} from './cart'
import {AUTHENTICATION_EFFECTS,AUTHENTICATION_SERVICES,AuthenticationReducer} from './authentication'

const effects = [
  ...PRODUCTS_EFFECTS,
  ...CART_EFFECTS
=======
import {ProductsReducer,PRODUCTS_EFFECTS,PRODUCT_SERVICES} from '../modules/product/store'
import {CartReducer,CART_EFFECTS} from '../modules/cart/store'
import {AUTHENTICATION_EFFECTS,AUTHENTICATION_SERVICES,AuthenticationReducer} from '../modules/authentication/store'

const effects = [
  ...PRODUCTS_EFFECTS,
  ...CART_EFFECTS,
  ...AUTHENTICATION_EFFECTS
>>>>>>> dummy-cr-neoito
]

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('products', ProductsReducer),
    StoreModule.forFeature('cart',CartReducer),
    StoreModule.forFeature('auth',AuthenticationReducer)
  ],
  declarations: [],
  providers: [
    PRODUCT_SERVICES,
<<<<<<< HEAD
=======
    AUTHENTICATION_SERVICES
>>>>>>> dummy-cr-neoito
  ]
  
})
export class AppStoreModule { }
