import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.scss']
})
export class UploadComponentComponent implements OnInit {

  @ViewChild('fileUpload',{static:true}) public fileSelect: any;
  @ViewChild('fileDrag',{static:true}) public fileDrag: any;
  @ViewChild('messages',{static:true}) public messages: any;
  @ViewChild('start',{static:true}) public start: any;
  @ViewChild('response',{static:true}) public response: any;
  @ViewChild('notImage',{static:true}) public notImage: any;
  @ViewChild('fileImage',{static:true}) public fileImage: any;
  @ViewChild('fileUploadForm',{static:true}) public fileUploadForm: any;
  @ViewChild('fileProgress',{static:true}) public fileProgress: any;

  public imageSource = '#';
  // public linearModel: tf.Sequential | undefined;
  public prediction: any;

  // public model: tf.Model | undefined;
  public imageForTest = new Image();
  predictions: any;

  constructor(
    private _httpService:HttpService,
  ) { 
    this.imageSource='#';
  }

  fileDragHover(e:any) {
    e.stopPropagation();
    e.preventDefault();
    this.fileDrag.nativeElement.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
  }

  fileSelectHandler(e:any) {
    var files = e.target.files || e.dataTransfer.files;
    this.fileDragHover(e);
    const f = files[0];
    this.parseFile(f);
    this.uploadFile(f);
  }

  output(msg:any) {
    this.messages.innerHTML = msg;
  }

  parseFile(file:any) {
    this.output(
      '<strong>' + encodeURI(file.name) + '</strong>'
    );
    var imageName = file.name;
    var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
    if (isGood) {
      this.start.nativeElement.classList.add("hidden");
      this.response.nativeElement.classList.remove("hidden");
      this.notImage.nativeElement.classList.add("hidden");
      this.fileImage.nativeElement.classList.remove("hidden");
    }
    else {
      this.fileImage.nativeElement.classList.add("hidden");
      this.notImage.nativeElement.classList.remove("hidden");
      this.start.nativeElement.classList.remove("hidden");
      this.response.nativeElement.classList.add("hidden");
      this.fileUploadForm.reset();
    }
  }

  setProgressMaxValue(e:any) {
    if (e.lengthComputable) {
      if(this.fileProgress){
        this.fileProgress.max = e.total;
      }
    }
  }

  updateFileProgress(e:any) {
    if (e.lengthComputable) {
      if(this.fileProgress){
        this.fileProgress.value = e.loaded;
      }
    }
  }

  uploadFile(file:any) {
    this._httpService.uploadFile(file).subscribe(res=>{
    });
    this._httpService.downloadFileByName('SkinImage.png').subscribe(res=>{
    })
    this._httpService.getFileList().subscribe(res=>{
      this.imageSource=res[0].url;
    })
  }

  // async loadModel() {
  //   this.model = await tf.loadModel('../../../assets/model.json');
  // }

  ngOnInit(): void {
    // this.loadModel();
    if (!(window.File && window.FileList && window.FileReader)) {
      this.fileDrag.innerHtml.style.display = 'none';
    }
  }
}

