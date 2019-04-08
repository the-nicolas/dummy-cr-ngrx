import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { TestModule } from './app.test';
import { WebApiService } from './modules/shared/services/web-api.service';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let api,store,transSrv,toastCtrl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    transSrv = fixture.debugElement.injector.get(WebApiService);
    store = fixture.debugElement.injector.get(Store);
    toastCtrl = fixture.debugElement.injector.get(ToastController);
  });


  //  write test cases only for the app.component and no other componenets.
  //  All others should be written in their corresponding component specs
  // an example spec has been written


  describe('Methods', ()=> {
    it('check value of  pages on load', ()=>{
        // arrange

        // act
      fixture.detectChanges();
        // assert
      expect(component.pages).toEqual([
        { title: 'Products', url: '/home', icon: 'apps' },
        { title: 'Invoice', url: '/home', icon: 'paper' },
        { title: 'Daily Report', url: '/home', icon: 'list-box' },
        { title: 'Admin', url: '/home', icon: 'lock' },
        { title: 'Settings', url: '/home', icon: 'settings' }
      ]);
    });

  });

});
