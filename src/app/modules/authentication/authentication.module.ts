import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AuthenticationRoutingModule
  ],
  declarations: [LoginPageComponent]
})
export class AuthenticationModule { }
