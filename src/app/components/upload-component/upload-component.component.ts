import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http-service.service';
import * as tf from '@tensorflow/tfjs';

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
  public linearModel: tf.Sequential | undefined;
  public prediction: any;

  public model: tf.LayersModel | undefined;
  public imageForTest = new Image();
  public classes = {
    'a': 0, 'b': 1,
    'c': 2, 'd':3, 'e':4, 'f':5, 'g':6,
  };
  predictions: any;
  public predicted_class;

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
      this.loadModelAndPredict(this.imageSource)
    })
    
  }

  predict(img) {
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, 'float32');
    const output = this.model.predict(img) as any;
    this.predictions = Array.from(output.dataSync());
    console.log(this.predictions);
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
  async loadModel() {
    this.model = await tf.loadLayersModel('../../../assets/model.json');
    console.log(this.model);
  }
  loadImage(src) {
    console.log(src)
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
    });
  }

  resizeImage(image) {
    return tf.image.resizeBilinear(image, [224, 224]);
  }

  batchImage(image) {
    const batchedImage = image.expandDims(0);
    return batchedImage.toFloat().div(tf.scalar(255));
  }

  loadAndProcessImage(image) {
    const resizedImage = this.resizeImage(image);
    const batchedImage = this.batchImage(resizedImage);
    console.log(image);
    return batchedImage;
  }

  loadModelAndPredict(image) {
    tf.loadLayersModel('../../../assets/model.json').then(pretrainedModel => {
        console.log(pretrainedModel);
        this.loadImage(image).then(img => {
            const processedImage = this.loadAndProcessImage(img);
            console.log(processedImage);
            const prediction = pretrainedModel.predict(processedImage);
            // Because of the way Tensorflow.js works, you must call print on a Tensor instead of console.log.    
            (prediction as tf.Tensor).print();
            // const result = prediction.as1D().argMax().dataSync()[0];
            const result = 'dont care'
            console.log(result);
            this.predicted_class = this.getKeyByValue(this.classes, result);
            console.log(this.predicted_class);
            document.querySelector("#hidebtn").innerHTML = "Predict";
        },
        err=>{
          console.log(err)
        });
    })
}
  ngOnInit(): void {
    this.loadModel();
    if (!(window.File && window.FileList && window.FileReader)) {
      this.fileDrag.innerHtml.style.display = 'none';
    }
  }
}

