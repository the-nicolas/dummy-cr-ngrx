import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ProductRoutingModule } from './product-routing.module';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductComponent } from './containers/product/product.component';
<<<<<<< HEAD
import { SharedModule } from '../shared/shared.module';
import { CreateArrayPipe } from '../shared/pipes/create-array.pipe';
=======
import { SharedModule } from '../../shared/shared.module';
import { CreateArrayPipe } from '../../shared/pipes/create-array.pipe';
>>>>>>> dummy-cr-neoito
import { ProductOptionsComponent } from './components/product-options/product-options.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    ProductRoutingModule,
  ],
  declarations: [ProductGridComponent,ProductComponent,CreateArrayPipe,ProductOptionsComponent],
  entryComponents: [ProductOptionsComponent]
})
export class ProductModule { }
