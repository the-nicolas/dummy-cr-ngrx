import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import Product from '../models/product.model';
import { Products } from './dummy-data';

@Injectable()
export class ProductService {
  getAllProducts(): Observable<Product[]> {
    return of(Products);
  }
  constructor() { }

}

