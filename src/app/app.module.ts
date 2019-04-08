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
import { SharedModule} from './modules/shared/shared.module'
import {ProductModule} from './modules/product/product.module'
import { AppStoreModule } from './store/store.module';
import { CartModule } from './modules/cart/cart.module';
import { CartComponent } from './modules/cart/containers/cart/cart.component';
import { CartItemComponent } from './modules/cart/components/cart-item/cart-item.component';



@NgModule({
  declarations: [AppComponent,CartComponent,CartItemComponent
    ],
  entryComponents: [CartComponent],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppStoreModule,
            AppRoutingModule,
            ProductModule,  
            CartModule,  
            SharedModule,StoreModule.forRoot({}),
            EffectsModule.forRoot([]),
            StoreDevtoolsModule.instrument(),
          ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
