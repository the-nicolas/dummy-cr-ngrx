import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot,Router } from "@angular/router";

// import rxjs
import { Observable } from "rxjs";

// import @ngrx
import { Store } from "@ngrx/store";

// reducers
import {
  isUserAuthenticated,
  AuthState
} from "../store";

/**
 * Prevent unauthorized activating and loading of routes
 * @class AuthenticatedGuard
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {

  /**
   * @constructor
   */
  constructor(private store: Store<AuthState>,private router: Router) {}

  /**
   * True when user is authenticated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // get observable
    const observable = this.store.select(isUserAuthenticated);

    // redirect to sign in page if user is not authenticated
    observable.subscribe(authenticated => {
      if (!authenticated) {
        this.router.navigate(['/sign-in']);
        return false;
      }
      else{
        return true
      }
    });

    return observable;
  }
}