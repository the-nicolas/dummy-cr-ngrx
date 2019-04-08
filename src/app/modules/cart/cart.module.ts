import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [InvoiceComponent],
  entryComponents:[InvoiceComponent]
})
export class CartModule { }
