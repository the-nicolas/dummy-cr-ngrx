import { Component, OnInit,Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Logout,ClearCart,getLoggedInUser, isUserAuthenticated} from '../../../store'

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {

  constructor(private store: Store<any>) {
    
   }

  ngOnInit() {    
  }

  Logout(){
    this.store.dispatch(new ClearCart())
    this.store.dispatch(new Logout())   

  }

}
