import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public finalResult;
  public classes = {
    'akiec' : 0, 'bcc' :1, 'bkl': 2, 'df': 3, 'mel' : 4,'nv' : 5,"sk": 6,"scc":7, 'vasc' : 8
  };
  constructor() { }

  ngOnInit(): void {
  }
  public getPredictions(event){
    var max = [Number.MIN_VALUE,-1];
    event.forEach((element,i=0) => {
      if(element>max[0]){
        max=[element,i]
      }
      i=i+1;
    });
    this.finalResult = [Object.keys(this.classes).find(key => this.classes[key]==max[1]),max[0]];
  }
}
