import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {ProductsReducer,PRODUCTS_EFFECTS,PRODUCT_SERVICES} from './products'
import {CartReducer,CART_EFFECTS} from './cart'
import {AUTHENTICATION_EFFECTS,AUTHENTICATION_SERVICES,AuthenticationReducer} from './authentication'

const effects = [
  ...PRODUCTS_EFFECTS,
  ...CART_EFFECTS
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
  ]
  
})
export class AppStoreModule { }
