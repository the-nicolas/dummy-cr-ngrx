import { Component } from '@angular/core';

import { Platform, ToastController, ModalController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HomePage } from './pages/home/home.page';
import { WebApiService } from './services/web-api.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  rootPage: any = HomePage;

  pages: Array<{ title: string, url: any, icon: string }>;
  totalProducts: number = 0;
  totalAmount: number = 0;

  constructor(
    public toastCtrl: ToastController,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    public api: WebApiService,
    private cartService: CartService,
    private transSrv: WebApiService,
    private events: Events,
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Products', url: '/home', icon: 'apps' },
      { title: 'Invoice', url: '/home', icon: 'paper' },
      { title: 'Daily Report', url: '/home', icon: 'list-box' },
      { title: 'Admin', url: '/home', icon: 'lock' },
      { title: 'Settings', url: '/home', icon: 'settings' }
    ];

    this.getCartValue();

    this.events.subscribe('cart:reload', (cart: any) => {
      this.getCartValue();
    });
    this.events.subscribe('cart:item:added', (item: any) => {
      this.getCartValue();
    });
    this.events.subscribe('cart:item:removed', (item: any) => {
      this.getCartValue();
    });
  }

  initializeApp() {

    this.api.auth.callCustom('login', { deviceUid: "crTest1" }).then(response => {

      if (response.body.hasOwnProperty("error")) {
        throw new Error(response.body.msg)
      } else {
        let tokenHeader = response.headers['authorization'];

        if (tokenHeader) {

          let tokStr = tokenHeader.split("Bearer ")[1];
          let t = { access: { header: tokenHeader, token: tokStr } };
          this.api.setCredentials({ token: t });

          this.api.client.open()

        } else {
          throw new Error("Token not found in login response header");
        }

      }

    });

    this.platform.ready().then(() => {
      // Status bar configurations
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#ffffff'); //00786c
      this.statusBar.styleDefault()

      // Hide splash screen
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    });
  }

  public onCheckout() {

    this.cartService.getValue().then((value: any) => {
      // let invoiceModal = this.modalCtrl.create(InvoicePage, {}, {cssClass: 'invoice-modal', showBackdrop: false});
      // invoiceModal.present();
      // this.nav.push(InvoicePage);

      const toastMessage = async (message) => {
        const toast = await this.toastCtrl.create({
          message: message,
          showCloseButton: true
        });
        toast.present();
      }

      let a = Math.round(value.totalAmount * 100);
      this.transSrv.transactions.create('{"total":' + a + '}').then(function (result) {
        toastMessage('Payment OK.');
        console.log(result)
      }, function (result) {
        toastMessage('Payment failed!');
        console.log("payment failed");
        console.log(result)
      }).catch(function (err) {
        toastMessage('Payment failed!');
        console.log("payment err");
        console.log(err)
      })
    });


  }

  public getCartValue() {
    this.cartService.getValue().then((value: any) => {
      this.totalProducts = value.totalProducts;
      this.totalAmount = value.totalAmount;
    });
  }

  /*public setSplitPane() {
      if (this.platform.is('ipad') || this.platform.is('tablet') || this.platform.width() > 992) {
          if (this.nav.getActive() === this.nav.first()) {
              return true;
          } else {
              return false;
          }
      } else {
          return false;
      }
  }*/
}
