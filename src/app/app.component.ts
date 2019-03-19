import { Component } from '@angular/core';
import { Platform, ToastController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HomePage } from './pages/home/home.page';
import { WebApiService } from './services/web-api.service';
import { Store, select } from '@ngrx/store';
import { CartState } from './store/state/cart.state';
import { selectTotalAmount, selectTotalProducts, selectCartList } from './store/selectors/cart.selector';
import { LoadCart } from './store/actions/cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  rootPage: any = HomePage;

  pages: Array<{ title: string, url: any, icon: string }>;
  totalProducts: any;
  totalAmount: any;
  cartValue: any;
  cartList: any;

  constructor(
    public toastCtrl: ToastController,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    public api: WebApiService,
    private transSrv: WebApiService,
    private store: Store<CartState>,
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
    this.store.dispatch(new LoadCart());

    this.cartList = this.store.pipe(select(selectCartList));
    this.totalAmount = this.store.pipe(select(selectTotalAmount));
    this.totalProducts = this.store.pipe(select(selectTotalProducts));
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
      this.statusBar.backgroundColorByHexString('#ffffff'); // 00786c
      this.statusBar.styleDefault()

      // Hide splash screen
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    });
  }

  public onCheckout() {
    const toastMessage = async (message) => {
      const toast = await this.toastCtrl.create({
        message: message,
        showCloseButton: true
      });
      toast.present();
    }

    let a = Math.round(this.totalAmount * 100);
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
    });
  }
}
