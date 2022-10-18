import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { viewRoutingModule } from './view-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { IndexComponent } from './index/index.component';
import { FormsModule } from '@angular/forms';
import { BodyComponent } from '../components/body/body.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DataService } from 'src/services/data.service';



@NgModule({
  declarations: [
    IndexComponent,
    NavBarComponent,
    BodyComponent
  ],
  imports: [
    CommonModule,
    viewRoutingModule,
    PdfViewerModule,
    FormsModule,
    ImageCropperModule
  ],
  providers: [
    DataService,
  ]
})
export class ViewModule { }
