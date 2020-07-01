import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { UserEvent } from './csv-reader';
import { HttpClient, HttpHeaders,HttpBackend, HttpResponse } from '@angular/common/http';
import { Config } from './csv-reader';
import { map } from 'rxjs/operators';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({ providedIn: 'root' })
export class ConfigService {
    static Settings: Config;
    private subject = new Subject<any>();
    private keepAfterRouteChange = false;
    bookName:String;
    constructor(private router: Router, private http:HttpClient,private httpBackEnd: HttpBackend) {
        this.http = new HttpClient(httpBackEnd);
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert message
                    this.clear();
                }
            }
        });
    }
    load() {
        const jsonFile = 'assets/config.json';
        return new Promise<void>((resolve, reject) => {
        this.http.get(jsonFile).toPromise().then((response: Config) => {
            ConfigService.Settings = <Config>response;
           resolve();
        }).catch((response: any) => {
           reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
        });
     }
    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'error', text: message });
    }

    clear() {
        // clear by calling subject.next() without parameters
        this.subject.next();
    }

    updateUserClickEvents(userEvent:String,apiUrl:String) {
        return this.http.post<Object>(apiUrl+"userClickData", userEvent);
      }


      downloadFile()
      {
          let fileUrl :String;
        var data = 'some data here...',
        blob = new Blob([data], { type: 'text/plain' }),
        url = window.URL || window.webkitURL;
        fileUrl = url.createObjectURL(blob);
      }

      //Fucntion to generate unique session Id based on date and time
      
      generateUniqueId(){
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
        //var uid = new Date().getTime().toString(36);
        //return uid;
      }

      getBookName(bookId:String){
        this.http.get('assets/csv/Final_Booklist.csv',{responseType: 'text'}).subscribe(data => {
            let output = (<string>data).split(/\r\n|\n/);
            let headersRow = this.getHeader(output);
            this.bookName = this.getBooksFromCSVFile(output,bookId,headersRow.length); 
           });
      }

      getHeader(csvRecordsArr: any) {  
        let headers = (<string>csvRecordsArr[0]).split(';');  
        let headerArray = [];  
        for (let j = 0; j < headers.length; j++) {  
          headerArray.push(headers[j]);  
        }  
        return headerArray;  
      } 

      getBooksFromCSVFile(output:any,selectedValue:String,headersRow:any){
        let bookName:String;  
        console.log('bookName for',selectedValue)
        for (let i = 1; i < output.length; i++) {  
          let curruntRecord = (<string>output[i]).split(';'); 
          if ((curruntRecord.length == headersRow) && (curruntRecord[0].trim() == selectedValue.replace("pg","").trim())) {   
            bookName = curruntRecord[1];             
          }  
        }  
        return bookName; 
      }

getGlobalFeatureExplaination(featurename:String){
  let tooltipinfo: String;
switch (featurename.trim()) {
  case "lexical richness":
      tooltipinfo = "Talks about the richness of the vocabulary used in the book";
      break;
  case "complexity of plot":
    tooltipinfo = "Refers to the complexity of the plots";
      break;
  case "ease of readability":
    tooltipinfo = "The level of ease in reading the book";
      break;
  case "sentiment":
    tooltipinfo = "Talks about the general feeling of the book";
      break;
  case "rural and urban setting":
    tooltipinfo = "Talks about the story being in an urban or rural setting";
      break;
  case "sentence complexity":
    tooltipinfo = "Talks about sentence complexity with respect to length, number of conjunctions and special characters";
      break;
  case "male oriented":
    tooltipinfo = "Higher presence of male personal and possessive pronouns indicating more male characters";
      break;
  case "female oriented":
    tooltipinfo = "Presence of female protogonist";
      break;
  case "writing style":
    tooltipinfo = "Talks about unique style of writing through quotes, conjunctions, prepositions";
      break;
  case "genre similarity":
    tooltipinfo = "Talks about similarities between books and their genres";
      break;
  case "female oriented":
    tooltipinfo = "Presence of female protogonist";
      break;
  case "anger":
     tooltipinfo = "Refers to the Book's Dominant Emotions";
      break;
  case "anticipation":
    tooltipinfo = "Refers to the Book's Dominant Emotions";
      break;
  case "disgust":
    tooltipinfo = "Refers to the Book's Dominant Emotions";
      break;
  case "fear":
    tooltipinfo = "Refers to the Book's Dominant Emotions";
      break;
  case "joy":
    tooltipinfo = "Refers to the Book's Dominant Emotions";
       break;
  case "sadness":
     tooltipinfo = "Refers to the Book's Dominant Emotions";
        break;
  case "surprise":
    tooltipinfo = "Refers to the Book's Dominant Emotions";
       break;
  case "trust":
    tooltipinfo = "Refers to the Book's Dominant Emotions";
     break;
  case "dialogue interaction":
     tooltipinfo ="Refers to talk-in interaction in the book";
     break;
  case "same book start and end similarity":
    tooltipinfo = "Both the books have almost same story line in the beginning and ending ";
    break;
  default:
    tooltipinfo = "Explaining the overall"+ featurename +" feature";
     break;
}
return tooltipinfo;
}

}