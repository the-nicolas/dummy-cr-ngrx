import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemComponent } from './cart-item.component';
import { TestModule } from 'src/app/app.test';
import { Store } from '@ngrx/store';
import { AddProduct } from 'src/app/store/cart';
import { CartItem } from 'src/app/store/models/cart.interface';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;
  let store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods', ()=> {
    it('addProduct',()=>{
      // arrange 
      let fakeCart:CartItem = {
        id: 2,
        title: '',
        isCategory: true,
        price: 2,
        count: 1,
        categoryId: 1,
        image: '',
        color: '',
      }
      spyOn(store,'dispatch')
      // act
      component.addProduct(fakeCart);

      // assert
      expect(store.dispatch).toHaveBeenCalledWith(new AddProduct(fakeCart))
    })
  })
});
