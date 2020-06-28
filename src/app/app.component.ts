import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CsvReader, simBooks, bookList, UserEvent} from './csv-reader';
import { ConfigService }  from './search.service';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { Subscription } from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {formatDate } from '@angular/common';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Routes, Router } from '@angular/router';
import { GraphAnalysisComponent } from './graph-analysis/graph-analysis.component';





declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] ,
  animations: [
    trigger('visibilityChanged', [
      state('shown' , style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate('.5s'))
    ])
    ]
  
  
})

@Injectable({
  providedIn: 'root'
})

export class AppComponent implements OnInit{
  @ViewChild('auto') auto;
  title = 'FictionUI';
  apiUrl:String;
  private subscription: Subscription;
  // Variables for Error Loading
  message: any;
  loading = false;
  errormsg:boolean = false;
  isDisabled:boolean = false;
  showSpinner: boolean = false;
  currentBookId: String;
  currentBookName: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private sanitizer:DomSanitizer,
    private router: Router){
    this.apiUrl = ConfigService.Settings.url.apiUrl;
    this.http.get(this.genreCsvUrl,{responseType: 'text'}).subscribe(data => {
    this.output = data.split(/\r\n|\n/);
    this.genre = this.getGenreRecordsArrayFromCSVFile(this.output); 
    });  
    $('.selectpicker').selectpicker('refresh');
  }
  
  isShow = true;
  p: number = 1;
  keyword = 'name'; 
  output = [];
  authors = [];
  topK: String = '10';
  uid: String; //Unique Id for each session
  userEventData: String;
  
  //Urls to fetch CSV file containg genre and book List
  genreCsvUrl = 'assets/csv/GENRE.csv';
  booksCsvUrl = 'assets/csv/Final_Booklist.csv';
  summaryUrl = 'assets/summary/';

  genre =[];
  public books = [];
  queryBookId: String;
  queryBookName: String;
  genreName: String;
  globalFeature: String;
  public dataList:simBooks[] = new Array();
  userEvents: UserEvent = new UserEvent();
  showModal: boolean;
  content: string;
  bookName: string;

  showCaptcha:boolean = true;
 
  filterChanged(selectedValue:string){
    this.genreName = selectedValue;
    this.books = [];
    this.http.get(this.booksCsvUrl,{responseType: 'text'}).subscribe(data => {
      this.output = (<string>data).split(/\r\n|\n/);
      let headersRow = this.getHeaderArray(this.output);
      this.authors = this.getAuthorsperGenre(this.output,selectedValue,headersRow.length);
      this.books = this.getBooksRecordsArrayFromCSVFile(this.output,selectedValue,headersRow.length); 
      this.queryBookId = '';
     });
   
    }

    selectEvent(item) {
      this.queryBookId = item.bookId.replace('.epub', '');
      this.queryBookName = item.name;
    }

    changeBooks(item){
      this.authors = item;
      this.books = this.books.filter(({ authorname }) => authorname.search(item) == -1); 
      console.log(this.books);
    }

  ngOnInit(): void {
  
    this.subscription = this.configService.getAlert()
    .subscribe(message => {
        switch (message && message.type) {
            case 'success':
                message.cssClass = 'alert alert-success';
                break;
            case 'error':
                message.cssClass = 'alert alert-danger fade in';
                break;
        }

        this.message = message;
    });
    this.filterChanged("All");

    setTimeout(function () {
      $('.selectpicker').selectpicker('refresh');
  },1000)

    $("#recaptchModal").modal('show');
   
  }
  getGenreRecordsArrayFromCSVFile(output:any) {  
    let csvArr = [];  
     
    for (let i = 0; i < output.length; i++) {    
        let csvRecord: CsvReader = new CsvReader();  
        csvRecord.id = i+1 ;  
        csvRecord.name = output[i] 
        csvArr.push(csvRecord);  
    }  
    return csvArr;  
  }
  
  getBooksRecordsArrayFromCSVFile(output:any,selectedValue:string,headersRow:any){
    let csvArr = [];  
    for (let i = 1; i < output.length; i++) {  
      let curruntRecord = (<string>output[i]).split(';'); 
      if (curruntRecord.length == headersRow && (curruntRecord[4].trim() == selectedValue.trim() || selectedValue == "All" )) {  
        let csvRecord: CsvReader = new CsvReader();  
        csvRecord.id = i;
        csvRecord.bookId = 'pg'+curruntRecord[0].trim();  
        csvRecord.name = curruntRecord[1].trim();  
        csvRecord.genre = curruntRecord[4].trim();  
        csvRecord.authorname = curruntRecord[3].trim().replace("|","");  
        const myObjStr =JSON.parse(JSON.stringify(csvRecord));
        csvArr.push(myObjStr);  
      }  
    }  
    return csvArr; 
  }

  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(';');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  myClickFunction() {
   this.p = 1;
    this.loading = true;
    this.isShow = false;
    this.showSpinner = true;
    this.globalFeature = '';
    this.dataList =[];
    this.http.get<bookList[]>( this.apiUrl + 'simbooks' + '/' + this.queryBookId + '/'+ this.topK).subscribe(data =>{
    this.dataList = JSON.parse(JSON.stringify(data["bookUI"]));
    this.globalFeature = data["globalFeature"];
    this.showSpinner = false;
  },error => {
    console.log(error);
    this.errormsg = true;
    this.loading = false;
    this.isShow = true;
    this.showSpinner = false;
    this.globalFeature = '';
  });
 }
 alertClose(){
  this.errormsg = false;
 }

 getAuthorsperGenre(output:any,genre:String,headersRow:any){
  let authorsList = [];  
  for (let i = 1; i < output.length; i++) {  
    let curruntRecord = (<string>output[i]).split(';'); 
    if (curruntRecord.length == headersRow && curruntRecord[2].trim() == genre.trim()) {  
      let temp =[];
      temp = curruntRecord[3].trim().split('|');  
      //const myObjStr =JSON.parse(JSON.stringify(temp));
      if(temp.length != 0)
      {
        temp.forEach(function (value) {
        authorsList.push(value);
      }); 
      }
    }  
  }  
  console.log(Array.from(new Set(authorsList)));
  return authorsList; 
 }
 //Bootstrap Modal Open event
show(event)
{
  console.log("summary is clicked");
  this.showModal = true; // Show-Hide Modal Check
  let bookId = event.target.getAttribute('data-filedata');
  this.bookName = event.target.value;    // Dynamic Data
  this.http.get(this.summaryUrl+ bookId+'.txt', { responseType: 'text'}).subscribe(
    data => this.content = data,
    error => this.configService.error("No Summary Data")
)
  $("#myModal").modal('show');
  this.userEventData = this.uid +','+ this.queryBookId + ',' + this.genreName + ',' + this.bookName +',' +  (new Date()).toString() ;
}
//Bootstrap Modal Close event
hide()
{
  this.showModal = false;
}
saveUserClickEvent()
{
  this.showModal = false;
  let temp: String;
  temp = this.userEventData +',' +  (new Date()).toString() + ';';
  this.configService.updateUserClickEvents(temp,this.apiUrl).subscribe(
    data => console.log(data),
    error => console.log(error));
  this.userEventData = '';
}
// Reloading Current Page
Reset()
{
 location.reload(true);
}

getArrayNumber = function(num) {
  var array = [];
  for (var i = null; i < num; i++) {
      array.push(i);
  };
 return array;   
};
sanitize(event){
  console.log("assets/epub/"+event.target.getAttribute('data-filedata') +".epub");
  let link = document.createElement("a");
  link.download = event.target.value;
  link.href = "assets/epub/"+ event.target.getAttribute('data-filedata') +".epub" ;
  link.click();
  
  //return this.sanitizer.bypassSecurityTrustUrl(url);
}

selecttopK(event: any){
  this.topK = event.target.value;
}

//Success for Recaptcha
handleSuccess(e) {
  this.uid = this.configService.generateUniqueId();
  console.log("Uid: ", this.uid);
  setTimeout(() => {
    $("#recaptchModal").modal('hide');
   }, 2000); 

}

goNext(event) {
  this.isShow =true;
  this.isDisabled = true;
  this.currentBookId = event.target.getAttribute('data-filedata');
  this.currentBookName =  event.target.getAttribute('data-fileValue');
  this.router.navigate(['/graph']);
}

}

