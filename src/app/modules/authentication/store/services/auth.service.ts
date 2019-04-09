import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from '../models/user.model';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  testUser: User = {email: 'user@email.com',password: '1234', token: 'sampleToken'};
 
  constructor() { }
 
  getToken(): string {
    return localStorage.getItem('token');
  }
 
  isLoggedIn() {
    const token = this.getToken();
    return token != null;
  }


  //mock login
  //replace with http call to server to login
   //return this.http.post<User>(url, {email, password});
  login(email: string, password: string): Observable<any> {    
    return new Observable((observer) => {
      console.log(email,password)
      if (email === this.testUser.email && password === this.testUser.password) {
        observer.next({email: this.testUser.email, token: this.testUser.token});
      } else {
        observer.error({error: 'invalid credentials.'});
      }
      observer.complete();
    });
    
  }
 
}