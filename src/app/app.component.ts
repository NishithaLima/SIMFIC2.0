import { Component, Injectable, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CsvReader, simBooks, bookList, UserEvent, GlobalFeatureArray} from './csv-reader';
import { ConfigService }  from './search.service';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { Subscription,Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatRadioButton} from '@angular/material/radio';



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
  @Input() checked: Boolean
  title = 'FictionUI';
  apiUrl:String;
  private subscription: Subscription;
  // Variables for Error Loading

  loading = false;
  errormsg:boolean = false;
  isDisabled:boolean = false;
  showSpinner: boolean = false;
  currentBookId: String;
  currentBookName: String;
  language: String = 'bt';

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router){
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
  booksCsvUrl = 'assets/csv/master2000_UI.csv';
  summaryUrl = 'assets/summary/';

  genre =[];
  public books = [];
  queryBookId: String;
  queryBookName: String;
  genreName: string;
  public globalFeatureList = [];
  public dataList:simBooks[] = new Array();
  userEvents: UserEvent = new UserEvent();
  showModal: boolean;
  content: string;
  bookName: string;
  selecteValue:string;
  gexplain:String[];

  showCaptcha:boolean = true;

  system:string;
 
  filterChanged(selectedValue:string){
    this.genreName = selectedValue;
    this.books = [];
    this.http.get(this.booksCsvUrl,{responseType: 'text'}).subscribe(data => {
      this.output = (<string>data).split(/\r\n|\n/);
      let headersRow = this.getHeaderArray(this.output);
      this.authors = this.getAuthorsperGenre(this.output,selectedValue,headersRow.length);
      this.books = this.getBooksRecordsArrayFromCSVFile(this.output,selectedValue,headersRow.length); 
      // console.log("BookList Count :",this.books.length);
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
     // console.log(this.books);
    }

  ngOnInit(): void {
    
    this.filterChanged("All");

    setTimeout(function () {
      $('.selectpicker').selectpicker('refresh');
  },1000)

    $("#recaptchModal").modal('show');

    this.system = "systemA";
    this.apiUrl = ConfigService.Settings.url.aUrl;
   
   
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
      if (curruntRecord.length == headersRow && (curruntRecord[6].trim() == selectedValue.trim() || selectedValue == "All" )) {  
        if(this.language != 'bt')
        {
          if((curruntRecord[2].trim() == this.language)){
        let csvRecord: CsvReader = new CsvReader();  
        csvRecord.id = i;
        csvRecord.bookId = 'pg'+curruntRecord[0].trim();  
        csvRecord.name = curruntRecord[1].trim();  
        csvRecord.genre = curruntRecord[6].trim();  
        csvRecord.authorname = curruntRecord[4].trim().replace("|","");  
        const myObjStr =JSON.parse(JSON.stringify(csvRecord));
        csvArr.push(myObjStr);  
          }
        }
        else
        {
          let csvRecord: CsvReader = new CsvReader();  
        csvRecord.id = i;
        csvRecord.bookId = 'pg'+curruntRecord[0].trim();  
        csvRecord.name = curruntRecord[1].trim();  
        csvRecord.genre = curruntRecord[6].trim();  
        csvRecord.authorname = curruntRecord[4].trim().replace("|","");  
        const myObjStr =JSON.parse(JSON.stringify(csvRecord));
        csvArr.push(myObjStr);  
        }
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
    this.showSpinner = true;
    this.errormsg = false;
    this.globalFeatureList = [];
    this.dataList =[];
    this.http.get<bookList[]>( this.apiUrl + 'simbooks' + '/' + this.queryBookId + '/'+ this.topK + '/' + this.language).subscribe(data =>{
    this.dataList = JSON.parse(JSON.stringify(data["bookUI"]));
    let testStr  = data["globalFeature"];
    this.globalFeatureList = this.getinfo(testStr);
    //console.log(data["bookUI"]);
    this.showSpinner = false;
    this.isShow = false;
  },error => {
    console.log(error);
    this.errormsg = true;
    this.loading = false;
    this.isShow = true;
    this.showSpinner = false;
    this.globalFeatureList = [];
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
  // console.log(Array.from(new Set(authorsList)));
  return authorsList; 
 }
 //Bootstrap Modal Open event
show(event)
{
  let bookId = event.target.getAttribute('data-filedata');
  let buttonText: String = event.target.textContent;
  
  if(buttonText.trim() == "Read more")
  {
  event.target.textContent = "Read less";
  this.bookName = event.target.getAttribute('value');    // Dynamic Data
  this.userEventData = this.uid +','+ this.queryBookId + ',' + this.genreName + ',' + this.bookName +',' +  (new Date()).toString() ;
  } 
  else
  {
    event.target.textContent = "Read more";
    $("#"+bookId).collapse('toggle');
    this.saveUserClickEvent();
  }
  $("#"+bookId).collapse('toggle');

}

saveUserClickEvent()
{
  this.showModal = false;
  let temp: String;
  temp =  this.userEventData +',' +  (new Date()).toString() + ';';
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
  // console.log("assets/epub/"+event.target.getAttribute('data-filedata') +".epub");
  let link = document.createElement("a");
  link.download = event.target.value;
  link.href = "assets/epub/"+ event.target.getAttribute('data-filedata') +".epub" ;
  link.click();
  
  //return this.sanitizer.bypassSecurityTrustUrl(url);
}

selecttopK(event: any){
  this.topK = event.target.value;
}

selectSystem(event: any){
this.system = event.target.value;
if(this.system === "systemB"){
  this.apiUrl = ConfigService.Settings.url.bUrl
} else
if(this.system === "systemC"){
  this.apiUrl = ConfigService.Settings.url.cUrl
} else
if(this.system === "systemA"){
  this.apiUrl = ConfigService.Settings.url.aUrl
}
console.log('System :', this.system);
}

//Success for Recaptcha
handleSuccess(e) {
  this.uid = this.configService.generateUniqueId();
  console.log("Uid: ", this.uid);
  setTimeout(() => {
    $("#recaptchModal").modal('hide');
    $("#exampleModalScrollable").modal('show');
   }, 2000); 

}

goNext(event) {
  this.isShow =true;
  this.isDisabled = true;
  this.currentBookId = event.target.getAttribute('data-filedata');
  this.currentBookName =  event.target.getAttribute('data-fileValue');
  this.router.navigate(['/graph']);
}

languageChange(event) {
  this.auto.clear();
  this.auto.close();
  let mrButton: MatRadioButton = event.source;
  this.language = mrButton.value;
  this. filterChanged(this.genreName);
} 

getinfo(testStr:String){
  let tempList =[];
  let gtemp = (testStr.substring(testStr.indexOf('?') + 1)).trim().split(',');
  if( tempList.length != null){
  for (let i = 0; i < gtemp.length; i++)
    {
      if(i == 0){
        let global: GlobalFeatureArray = new GlobalFeatureArray();
      global.name = gtemp[i];
      global.tooltip = this.configService.getGlobalFeatureExplaination(gtemp[i]);
      tempList.push(global);
      }
      else {
      let global: GlobalFeatureArray = new GlobalFeatureArray();
      global.name = (','+ gtemp[i]).trim();
      global.tooltip = this.configService.getGlobalFeatureExplaination(gtemp[i]);
      tempList.push(global); 
      }
    }
    return tempList; 
  }
}
public getsummary(): Observable<any>{
  return  this.http.get(this.summaryUrl,{responseType: 'text'});
}
getNumber = function(num) {
  let i = this.topK ;
  if(i == 10)
  {
    return new Array(11 -num);  
  }
  else if(i == 15)
  {
    return new Array(16-num);
  }
  else if(i == 20){
    return new Array(21-num);
  }
   
}


}

