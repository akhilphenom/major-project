import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const httpOptions = {
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public url = "http://localhost:9909"
  constructor(private http: HttpClient) { }
  
  getFileList() {
    return this.http.get<any>(this.url + '/files');
  }
  uploadFile(file:any){
    const uploadData = new FormData();
    uploadData.append('file', file, 'SkinImage.png');
    return this.http.post(this.url + '/upload', uploadData);
  }
  downloadFileByName(fileName:string) {
    return this.http.get<any>(this.url+`/files/${fileName}`,httpOptions);
  }
}
