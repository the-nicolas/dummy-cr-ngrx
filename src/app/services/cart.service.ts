import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(public http: HttpClient, private storage: Storage) {

  }

  public addItem(product: any, option: any = {}) {
    return this.storage.get('cart').then(cart => {
      cart = cart || [];
      let prod = cart.find(p => p.id === product.id);
      if (prod) {
        prod.__count += 1;
        product = prod;
      } else {
        product.__count = 1;
        cart.push(product);
      }

      return this.storage.set('cart', cart).then(data => {
        return Promise.resolve(product);
      });

    }).catch(err => {
      return Promise.reject(err);
    });
  }

  /**
   * get product from cart by id
   * @param {any} id product it
   */
  public getItem(id: any) {
    return this.storage.get('cart').then(cart => {
      cart = cart || [];
      let prod = cart.find(p => p.id === id);
      return Promise.resolve(prod);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  public removeItem(product: any, count: number = 1) {
    return this.storage.get('cart').then(cart => {
      cart = cart || [];
      let prod = cart.find(p => p.id === product.id);
      if (prod) {
        prod.__count -= count;
        if (prod.__count <= 0) {
          cart.splice(cart.indexOf(prod), 1);
        }
      }

      return this.storage.set('cart', cart).then(data => {
        return Promise.resolve(prod);
      });
    });
  }

  public get() {
    return this.storage.get('cart').then(cart => {
      cart = cart || [];
      return Promise.resolve(cart);
    }).catch(err => {
      return Promise.reject(err);
    })
  }

  public clear() {
  }

  public count() {
    return this.storage.get('cart').then(cart => {
      cart = cart || [];
      let totalProducts = 0;
      cart.forEach(p => {
        totalProducts += p.__count;
      });

      return Promise.resolve(totalProducts);
    });
  }

  public getValue() {
    return this.storage.get('cart').then(cart => {
      cart = cart || [];
      let resp = {
        totalAmount: 0,
        totalProducts: 0
      }
      cart.forEach(p => {
        resp.totalProducts += p.__count;
        resp.totalAmount += (p.__count * p.price);
      });
      return Promise.resolve(resp);
    });
  }
}
