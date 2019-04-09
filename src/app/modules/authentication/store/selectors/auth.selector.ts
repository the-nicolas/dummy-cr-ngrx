import {
    AuthenticationReducer,
    AuthState
  } from "../../../../store";
import { state } from '@angular/animations';
export const isUserAuthenticated = (state: AuthState) => {
  if(localStorage.getItem('token')!==null){
      return true
  }
  else{
    state.isAuthenticated
  }
};

export const getLoggedInUser = (state:AuthState) => state.user