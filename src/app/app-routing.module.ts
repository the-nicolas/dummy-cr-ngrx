import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthenticatedGuard} from './shared/authentication.guard'
import { LoginPageComponent } from './modules/authentication/containers/login-page/login-page.component';

const appRoutes: Routes = [ {
    path:'sign-in',
    component:LoginPageComponent

  },{
    path: '',   
    canActivate: [AuthenticatedGuard], 
    loadChildren: './modules/product/product.module#ProductModule'
  },
  ]


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}