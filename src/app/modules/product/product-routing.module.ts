import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD

// import { ProductCardComponent } from './components/product-card/product-card.component';
=======
import {AuthenticatedGuard} from '../../shared/authentication.guard'
>>>>>>> dummy-cr-neoito
import { ProductComponent } from './containers/product/product.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'product',
    pathMatch: 'full'
  },
  {
    path: 'product',
    component: ProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
