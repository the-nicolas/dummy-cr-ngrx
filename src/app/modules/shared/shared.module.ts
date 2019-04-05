import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TopNavComponent } from './components/top-nav/top-nav.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [TopNavComponent],
  exports: [
    TopNavComponent
  ]
})
export class SharedModule { }
