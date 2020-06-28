import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Routes, Router } from '@angular/router';
import { AppComponent } from  '../app.component';
import { HttpClient } from '@angular/common/http';
import { GraphList, GraphData } from '../csv-reader';
import { ConfigService }  from '../search.service';



@Component({
  selector: 'app-graph-analysis',
  templateUrl: './graph-analysis.component.html',
  styleUrls: ['./graph-analysis.component.css']
})
export class GraphAnalysisComponent {

 

  grapgListUrl = 'assets/csv/milestone3_emo_features.csv'

  multi: any[];
  view: any[] = [1000, 600];

  // options
  legend: boolean = true;
  legendPosition: string = 'right';
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Narrative time';
  yAxisLabel: string = 'Collective emotions';
  timeline: boolean = true;
  showGridLines:boolean = false;
  legendTitle = "Books"
  trimXAxisTicks: boolean = true;
  

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private router: Router,private app:AppComponent,private http: HttpClient,private configService:ConfigService) {
    //Object.assign(this, { multi });
    //console.log(multi);
    this.getGraphDatafromCsv(this.app.currentBookId);
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  goback(){
    this.app.showSpinner = true;
    this.router.navigate([''])
    this.app.isShow = false;
    this.app.showSpinner = false;
    this.app.isDisabled = false;
  }

  getGraphDatafromCsv(bookId:String)
  {
    console.log("QueryBookID: ",this.app.queryBookId);
    console.log("CurrentBookID: ", bookId);
    let queryBookId = this.app.queryBookId ;
    let queryBookName = this.app.queryBookName;
    let bookName = this.app.currentBookName;
    this.http.get(this.grapgListUrl,{responseType: 'text'}).subscribe(data => {
      let output = (<string>data).split(/\r\n|\n/);
      let headersRow = this.app.getHeaderArray(output);
     let multi_1 = this.getGraphList(output,bookId,bookName,headersRow);
     let multi_2 = this.getGraphList(output,queryBookId,queryBookName,headersRow);
     let gList = [];
     gList.push(JSON.parse(JSON.stringify(multi_1)));
     gList.push(JSON.parse(JSON.stringify(multi_2)))
     this.multi = gList;
     console.log(this.multi);
     });

  }

  getGraphList(output:any,bookId:String,bookName:String,headersRow:any){
    let csvArr = [];  
    let count = 0;
    let name = bookId;
    let graphList: GraphList = new GraphList();  
    graphList.name = bookName;
    for (let i = 1; i < output.length; i++) {  
      let curruntRecord = (<string>output[i]).split(';');
      if (curruntRecord.length == headersRow.length && (curruntRecord[0].trim() == bookId.trim() )) { 
        //if(count == 1000){
          // break;
        //}
        //else{
         // count = count + 1;
          let graphData: GraphData = new GraphData();  
          graphData.name = curruntRecord[1].trim();  
          graphData.value = curruntRecord[2].trim();   
          const myObjStr =JSON.parse(JSON.stringify(graphData));
          csvArr.push(myObjStr); 
        //} 
      }
    }
    graphList.series = csvArr;  
    console.log(graphList);
    return graphList;
}

}



