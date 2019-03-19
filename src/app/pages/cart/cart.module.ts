import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CartPage } from './cart.page';
import { ComponentModule } from '../../components/component.module';
import { IonicStorageModule } from '@ionic/storage';
import { StoreModule } from '@ngrx/store';
import { CartReducer } from '../../store/reducers/cart.reducer';

const routes: Routes = [
  {
    path: '',
    component: CartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentModule,
    IonicStorageModule,
    StoreModule.forFeature('cart', CartReducer),
  ],
  declarations: [
    CartPage,
  ],
  entryComponents: [
    CartPage,
  ],
})
export class CartPageModule { }
