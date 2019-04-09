import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {Login} from '../../../../store'
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  

  constructor(private store: Store<any>) { }

  ngOnInit() {}

  toggleLogin(){
    console.log('toggle login')
    
    let dummy_user_details = {
        email: 'user@email.com',password: '1234'
    }

    this.store.dispatch( new Login(
      dummy_user_details
    ))
  }

}
