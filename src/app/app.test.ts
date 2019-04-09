import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { AppComponent } from '../app/app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { AppStoreModule } from './store/store.module';
import { AppRoutingModule } from './app-routing.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CartItemComponent } from './modules/cart/components/cart-item/cart-item.component';
import { CartComponent } from './modules/cart/containers/cart/cart.component';
import { WebApiServiceMock } from './modules/mocks/services/webApi.service.mock';
import { WebApiService } from './shared/services/web-api.service';

export class MockNavParams {
    data = {
    };

    get(param) {
        return this.data[param];
    }
}


@NgModule({
    declarations: [
        AppComponent,
        CartItemComponent,
        CartComponent
    ],
    imports: [
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        BrowserAnimationsModule,
        SharedModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppStoreModule,
        AppRoutingModule,
        ProductModule,
        CartModule,
        SharedModule, StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument(),
    ],
    providers: [
        {provide: NavParams, useClass: MockNavParams},
        {provide: WebApiService, useClass: WebApiServiceMock},
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        // { provide: LoginService, useClass: LoginServiceMock },
        Store,
    ],
    bootstrap: [AppComponent]
})

export class TestModule { }

