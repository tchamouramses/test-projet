import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { Data } from 'src/models/Data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelService } from 'src/services/model.service';
import { Model } from 'src/models/Model';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  public isLoading?: boolean = false;
  public isLoadingModel?: boolean = false;
  public isLoadingDatas?: boolean = false;
  public datas!: Data[];
  public models!: Model[];
  public form: FormGroup = this.formBuilder.group({});
  public formModel: FormGroup = this.formBuilder.group({});
  public formData: FormGroup = this.formBuilder.group({});
  public selectedImage: any;
  public extractedTex: any;
  public extractedData!: Data;
  constructor(
    public dataService: DataService,
    public modelService: ModelService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.records();
    this.form = this.formBuilder.group({
      file: ['', Validators.required]
    });
    this.formModel = this.formBuilder.group({
      nom: [''],
      template: ['', Validators.required]
    });
    this.formData = this.formBuilder.group({
      nom_medecin: ['', Validators.required],
      nom_hopital: ['', Validators.required],
      tarif: ['', Validators.required],
      contenue: ['']
    });
  }

  get accept() {
    return '.jpg, .jpeg, .png';
  }

  records() {
    this.modelService.records().subscribe(res => {
      this.models = res.data;
    });
    this.dataService.record().subscribe(res => {
      this.datas = res?.data;
    });
  }

  onSelectImage(event: any) {
    this.selectedImage = event.srcElement.files[0];
  }

  public extract() {
    if (this.selectedImage) {
      this.isLoading = true;
      var data = new FormData();
      data.append("image", this.selectedImage, this.selectedImage.name)
      this.dataService.extractData(data).subscribe(res => {
        this.extractedData = res.data ?? null;
        this.isLoading = false;
      })
    }
  }

  public saveModel() {
    if (this.formModel.invalid) {
      return;
    }
    this.isLoadingModel = true;
    this.modelService.saveData(this.formModel.value).subscribe(res => {
      this.records();
    })
  }

  public save() {
    if (this.formData.invalid) {
      return;
    }
    this.isLoadingDatas = true;
    this.extractedData = { ...this.formData.value, model_id: this.extractedData.model_id };
    this.dataService.save(this.extractedData).subscribe(res => {
      this.records();
      this.isLoadingDatas = false;
    });
  }

  public delete(item: Data) {
    this.dataService.delete(item).subscribe(res => {
      if (res.status == 200) {
        this.records();
      }
    })
  }

  public deleteModel(item: Data) {
    this.modelService.delete(item).subscribe(res => {
      if (res.status == 200) {
        this.records();
      }
    })
  }
}
