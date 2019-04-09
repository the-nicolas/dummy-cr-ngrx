import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
<<<<<<< HEAD
import { SharedModule} from './modules/shared/shared.module'
=======
import { SharedModule} from './shared/shared.module'
>>>>>>> dummy-cr-neoito
import {ProductModule} from './modules/product/product.module'
import { AppStoreModule } from './store/store.module';
import { CartModule } from './modules/cart/cart.module';
import { CartComponent } from './modules/cart/containers/cart/cart.component';
import { CartItemComponent } from './modules/cart/components/cart-item/cart-item.component';
<<<<<<< HEAD
=======
import { AuthenticatedGuard } from './shared/authentication.guard';
import { AuthenticationModule } from './modules/authentication/authentication.module';
>>>>>>> dummy-cr-neoito



@NgModule({
  declarations: [AppComponent,CartComponent,CartItemComponent
    ],
  entryComponents: [CartComponent],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppStoreModule,
            AppRoutingModule,
<<<<<<< HEAD
            ProductModule,  
            CartModule,  
            SharedModule,StoreModule.forRoot({}),
=======
            AuthenticationModule,
            ProductModule,  
            CartModule,  
            SharedModule,
            StoreModule.forRoot({}),
>>>>>>> dummy-cr-neoito
            EffectsModule.forRoot([]),
            StoreDevtoolsModule.instrument(),
          ],
  providers: [
    StatusBar,
    SplashScreen,
<<<<<<< HEAD
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
=======
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthenticatedGuard
>>>>>>> dummy-cr-neoito
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
