import { Component, OnInit } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { PDFDocumentProxy } from 'ng2-pdf-viewer/public_api';
import html2canvas from 'html2canvas';
import Cropper from 'cropperjs';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DataService } from 'src/services/data.service';
import { Template } from 'src/utils/constants';
import { Data } from 'src/models/Data';
import { Model } from 'src/models/Model';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  public typeFichier: string = 'PDF';
  public extractText?: string;
  public selectedFile: any;
  public pdfSrc: any;
  public isCropImage!: boolean;
  public cropper!: Cropper;
  public validateCropping: boolean = false;
  public imageFromPdf!: any;

  public data?: Data;
  public modelData?: Model;


  public model?: string = "model";

  public tarif?: number;
  public nom_medecin?: string;
  public nom_hopital?: string;
  public contenue?: string;
  public model_id?: Model;
  public error?: string;
  public saveModel?: boolean = false;
  public isLoading?: boolean = false;
  public extractLoading?: boolean = false;

  public datas!: Data[];

  constructor(
    public dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.getModel();
  }

  get accept() {
    return this.typeFichier == 'IMG' ? '.jpg, .jpeg, .png' : '.pdf';
  }

  openCropModal(event: any) {
    this.extractText = undefined;
    if (this.typeFichier == 'IMG') {
      this.extractTextFromImage();
    } else {
      this.uploadPdfFile(event);
    }
  }

  extractTextFromImage() {
    let $img: any = document.querySelector('#upload-doc');
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = e.target.result;
      };
      this.isPdfUploaded = true;
      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  extractTextFromPdf() {
    let $img: any = document.querySelector('#upload-doc');
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = e.target.result;
      };
      this.isPdfUploaded = true;
      reader.readAsArrayBuffer($img.files[0]);
    }
    this.extraction();
  }

  extraction() {
    var file = this.selectedFile;
    if (this.typeFichier != 'IMG') {
      file = this.imageFromPdf;
    }
    this.extractLoading = true;
    Tesseract.recognize(
      file,
      'fra',
      { logger: m => this.progressNumber = Math.ceil(m.progress * 100) }
    ).then(({ data: { text } }) => {
      this.extractText = text;
      this.getDataFromFacture(Template.FACTURE);
    }).finally(() => {
      this.extractLoading = false;
    })
  }

  public uploadPdfFile(event: any) {
    let $img: any = document.querySelector('#upload-doc');
    if (event.target.files[0].type == 'application/pdf') {
      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
          console.log(this.pdfSrc);

        };
        this.isPdfUploaded = true;
        reader.readAsArrayBuffer($img.files[0]);
      }
    } else {
      alert('Please upload pdf file')
    }
  }

  public cropPdfToImage() {
    html2canvas(document.querySelector(".pdf-container") as HTMLElement).then((canvas: any) => {
      let ctx = canvas.getContext('2d');
      ctx.scale(3, 3);
      let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
      var img = document.getElementById('cropper-img') as HTMLImageElement;
      img.setAttribute('src', image);
      img.setAttribute('class', 'ready');
      this.isCropImage = true
      let cropImg: any = img;
      this.cropper = new Cropper(cropImg, {
        zoomable: true,
        background: false,
        guides: false,
        highlight: false,
        movable: false,
        responsive: true,
        ready: (e) => {
          let cropper = this.cropper;
        },
        crop: (e) => {
        }
      });
    })
  }

  public crop() {
    if (this.isCropImage) {
      let canvas = this.cropper.getCroppedCanvas();
      this.getCanvasToDownload(canvas)
    } else {
      html2canvas(document.querySelector(".pdf-container") as HTMLElement).then((canvas: any) => {
        this.getCanvasToDownload(canvas)
      })
    }
    this.selectedFile = 1235458;
  }



  private getCanvasToDownload(canvas: any) {
    let ctx = canvas.getContext('2d');
    ctx.scale(3, 3);
    let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
    this.validateCropping = true;
    this.imageFromPdf = image;
  }

  public reset() {
    this.isCropImage = false;
    this.validateCropping = false;
    this.cropper.clear();
    this.cropper.destroy();
  }

  public zoomOut() {
    this.cropper.zoom(0.1)
  }

  public zoomIn() {
    this.cropper.zoom(-0.1)
  }

  public onRotate() {
    this.cropper.rotate(90)
  }

  getModel() {
    this.dataService.record().toPromise().then(res => {
      this.datas = res?.data;
    })
  }

  getDataFromFacture(template: Template) {
    if (template == Template.RECU) {
      var valueStart = this.extractText?.search('Montant facture :') ?? -1;
      var valueEnd = this.extractText?.search('Rente à payerclient');
      if (valueEnd == -1) {
        valueEnd = this.extractText?.search('Reste à payer client') ?? -1;
      }
      if (valueEnd != -1 && valueStart != -1) {
        var montant = this.extractText?.substring(valueStart + 18, valueEnd);
        var position = montant?.search('FCFA');
        if (position == -1) {
          position = montant?.search('F.CFA');
        }
        if (position != -1) {
          montant = montant?.substring(0, position)
          const totalPrice = parseFloat(montant ?? '0');
          this.tarif = totalPrice;
        }
      }
    } else if (Template.FACTURE) {
      this.model = this.extractText?.substring(4, 31);
      var valueStart = this.extractText?.search('Net à payer') ?? -1;
      var valueEnd = this.extractText?.search('Arrôtéo');
      if (valueEnd == -1) {
        valueEnd = this.extractText?.search('arrêtée') ?? -1;
      }
      if (valueEnd != -1 && valueStart != -1) {
        var montant = this.extractText?.substring(valueStart + 11, valueEnd).trim().replace(' ', '');
        const totalPrice = parseFloat(montant ?? '0');
        this.tarif = totalPrice;
      }
      this.nom_hopital = 'POLYCLINIQUE CENTRALE ABOBO';
      //extraction du contenue
      const contentStart = this.extractText?.search('Date') ?? -1;
      const contentEnd = this.extractText?.search('Expédiée') ?? -1;
      if (contentStart != -1 && contentEnd != -1) {
        this.contenue = this.extractText?.substring(contentStart, contentEnd).trim();
        var content_tmp = this.extractText?.substring(contentStart, contentEnd).trim();
        //extraction des medecins dans le contenue
        this.nom_medecin = '';
        while (content_tmp?.search('Dr') != -1) {
          var docStart = content_tmp?.search('Dr') ?? -1;
          content_tmp = content_tmp?.substring(docStart, content_tmp.length)
          docStart = content_tmp?.search('Dr') ?? -1;
          const docEnd = content_tmp?.search('/') ?? -1;
          this.nom_medecin += (this.nom_medecin == '' ? '' : '; ') + content_tmp?.substring(docStart, docEnd) ?? '';
          content_tmp = content_tmp?.substring(docEnd + 1, content_tmp.length)
        }
      }
    }
  }

  save() {
    this.data = {
      contenue: this.contenue,
      nom_hopital: this.nom_hopital,
      nom_medecin: this.nom_medecin,
      tarif: this.tarif,
      model_id: {
        template: this.model,
        nom: this.model,
      },
      saveModel: this.saveModel ?? false
    }
    this.isLoading = true;
    this.dataService.saveData(this.data).toPromise().then(res => {
      if (res?.status != 200) {
        this.error = res?.message;
      }
      this.getModel();
    }).finally(() => {
      this.isLoading = false;
    });
  }


  public imageData = 'assets/recu.png';
  public textreaderFromImage: string = '';
  public textreaderFromPdf: string = '';
  totalPages!: number;
  isPdfUploaded: boolean = false;
  progressNumber: number = 0;

  readtextFromImage() {
    Tesseract.recognize(
      this.imageData,
      'eng',
      { logger: m => this.progressNumber = Math.ceil(m.progress * 100) }
    ).then(({ data: { text } }) => {
      this.textreaderFromImage = text;
    })
  }
  get width() {
    return 'width: ' + this.progressNumber + '%;';
  }

  pdfToImage() {
    Tesseract.recognize(
      this.imageFromPdf,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      this.textreaderFromPdf = text;
    })
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
  }

}
