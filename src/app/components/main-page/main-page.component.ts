import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public finalResult;
  public classes = {
    'Actinic keratoses and intraepithelial carcinoma' : 0, 
    'Basal cell carcinoma' :1, 
    'Benign lesions of the keratosis': 2, 
    'Dermatofibroma': 3, 
    'Melanoma' : 4,
    'Melanocytic nevi' : 5,
    "Seborrheic keratosis": 6,
    "Squamous cell carcinoma":7, 
    'Vascular lesions' : 8
  };
  public selected:string ='';
  public predictions;
  public predictionClasses=[];
  constructor() { }

  ngOnInit(): void {
    this.selected='';
  }
  public getPredictions(event){
    this.predictions=event;
    var max = [Number.MIN_VALUE,-1];
    event.forEach((element,i=0) => {
      if(element>max[0]){
        max=[element,i]
      }
      i=i+1;
    });
    this.finalResult = [Object.keys(this.classes).find(key => this.classes[key]==max[1]),max[0]];
    for(let i=0;i<Object.keys(this.classes).length;i++){
      this.predictionClasses[i]=Object.keys(this.classes).find(key=>this.classes[key]==i);
    }
    console.log(this.predictionClasses)
  }
}
