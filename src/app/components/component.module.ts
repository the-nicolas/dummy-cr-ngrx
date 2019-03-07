import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartListComponent } from './cart-list/cart-list.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { IonicModule } from '@ionic/angular';
import { CreateArrayPipe } from '../pipes/create-array.pipe';

@NgModule({
  declarations: [
    CartListComponent,
    ProductGridComponent,
    CreateArrayPipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    CartListComponent,
    ProductGridComponent,
  ],
  providers: [],
})
export class ComponentModule { }