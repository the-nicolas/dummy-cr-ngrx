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
    return new Promise((resolve, reject) => {
      this.storage.get('cart').then(cart => {
        cart = cart || [];
        let prod = cart.find(p => p.id === product.id);
        if (prod) {
          prod.__count += 1;
          product = prod;
        } else {
          product.__count = 1;
          cart.push(product);
        }

        this.storage.set('cart', cart).then(data => {
          resolve(product);
        });

      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * get product from cart by id
   * @param {any} id product it
   */
  public getItem(id: any) {
    return new Promise((resolve, reject) => {
      this.storage.get('cart').then(cart => {
        cart = cart || [];
        let prod = cart.find(p => p.id === id);
        resolve(prod);
      }).catch(err => {
        reject(err);
      });
    });
  }

  public removeItem(product: any, count: number = 1) {
    return new Promise((resolve, reject) => {
      this.storage.get('cart').then(cart => {
        cart = cart || [];
        let prod = cart.find(p => p.id === product.id);
        if (prod) {
          prod.__count -= count;
          if (prod.__count <= 0) {
            cart.splice(cart.indexOf(prod), 1);
          }
        }

        this.storage.set('cart', cart).then(data => {
          resolve(prod);
        });
      });
    });
  }

  public get() {
    return new Promise((resolve, reject) => {
      this.storage.get('cart').then(cart => {
        cart = cart || [];
        resolve(cart);
      }).catch(err => {
        reject(err);
      })
    });
  }

  public clear() {
  }

  public count() {
    return new Promise(resolve => {
      this.storage.get('cart').then(cart => {
        cart = cart || [];
        let totalProducts = 0;
        cart.forEach(p => {
          totalProducts += p.__count;
        });

        resolve(totalProducts);
      });
    });
  }

  public getValue() {
    return new Promise(resolve => {
      this.storage.get('cart').then(cart => {
        cart = cart || [];
        let resp = {
          totalAmount: 0,
          totalProducts: 0
        }
        cart.forEach(p => {
          resp.totalProducts += p.__count;
          resp.totalAmount += (p.__count * p.price);
        });
        resolve(resp);
      });
    });
  }
}
