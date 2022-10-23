import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { viewRoutingModule } from './view-routing.module';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { IndexComponent } from './index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyComponent } from '../components/body/body.component';
import { DataService } from 'src/services/data.service';
import { ModelService } from 'src/services/model.service';



@NgModule({
  declarations: [
    IndexComponent,
    NavBarComponent,
    BodyComponent
  ],
  imports: [
    CommonModule,
    viewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    DataService,
    ModelService,
  ]
})
export class ViewModule { }
