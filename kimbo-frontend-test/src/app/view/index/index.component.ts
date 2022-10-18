import { Component, OnInit } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { PDFDocumentProxy } from 'ng2-pdf-viewer/public_api';
import html2canvas from 'html2canvas';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
