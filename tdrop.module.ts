import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule} from '@angular/material';
import { TdropPage } from './tdrop';

@NgModule({
  declarations: [
    TdropPage,
  ],
  imports: [
    IonicPageModule.forChild(TdropPage),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule
  ],
})
export class TdropPageModule {}
