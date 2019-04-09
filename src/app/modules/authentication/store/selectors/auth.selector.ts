import {
    AuthenticationReducer,
    AuthState
  } from "../../../../store";
export const isUserAuthenticated = (state: AuthState) => {
  if(localStorage.getItem('token')!==null){
      return true
  }
  else{
    state.isAuthenticated
  }
};