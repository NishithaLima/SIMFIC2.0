import { Component, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { GraphList, GraphData, WordCloudData } from '../csv-reader';
import { ConfigService } from '../search.service';
import { CloudData, ZoomOnHoverOptions, CloudOptions } from 'angular-tag-cloud-module';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-graph-analysis',
  templateUrl: './graph-analysis.component.html',
  styleUrls: ['./graph-analysis.component.css']
})
export class GraphAnalysisComponent {

  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3, // Elements will become 130 % of current zize on hover
    transitionTime: 1, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
    delay: 0.2 // Zoom will take affect after 0.8 seconds
  };
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value 
    width: 1000,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value 
    height: 900,
    overflow: false,
  };

  data: CloudData[] = [
    { text: 'happy', weight: 5 },
    { text: 'user', weight: 7 },
    { text: 'hour', weight: 9 },
    { text: 'manner', weight: 3 },
    { text: 'length', weight: 2 },
    { text: 'letter', weight: 1 },
    { text: 'investigation', weight: 10 },
    { text: 'client', weight: 12 }
    // ...
  ];
  topicdata = [];
  grapgListUrl = 'assets/csv/emotion_graphs_combined.csv'
  topicsURL = 'assets/csv/topics_df_combined.csv'
  grapgListUrl_ = 'assets/csv/pivoted_emotions_per_time.csv'


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
  showGridLines: boolean = false;
  legendTitle = "Books"
  trimXAxisTicks: boolean = true;
  showContent: boolean = false;


  colorScheme = {
    domain: ['#6b8e23', '#191970', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private router: Router, private app: AppComponent, private http: HttpClient, private configService: ConfigService) {
    //Object.assign(this, { multi });
    //console.log(multi);

    this.app.showSpinner = true;
    this.getTopics().subscribe(data => {
      let output = (<string>data).split(/\r\n|\n/);
      this.topicdata = this.getTopicsList(output, this.app.queryBookId, this.app.currentBookId)
      this.app.showSpinner = false;
      this.showContent = true;
    }, error => {
      this.app.showSpinner = false;
      this.app.errormsg = true;
      this.showContent = false;
    });
    this.getGraphDatafromCsv(this.app.currentBookId);

  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
  //  console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  goback() {
    this.app.showSpinner = true;
    this.router.navigate([''])
    this.app.isShow = false;
    this.app.showSpinner = false;
    this.app.isDisabled = false;
  }

  getGraphDatafromCsv(bookId: String) {
    console.log("QueryBookID: ", this.app.queryBookId);
    console.log("CurrentBookID: ", bookId);
    let queryBookId = this.app.queryBookId;
    let queryBookName = this.app.queryBookName;
    let bookName = this.app.currentBookName;
    this.http.get(this.grapgListUrl_, { responseType: 'text' }).subscribe(data => {
      let output = (<string>data).split(/\r\n|\n/);
      let headersRow = this.app.getHeaderArray(output);
      let multi_1 = this.getGraphList(output, bookId, bookName, headersRow);
      let multi_2 = this.getGraphList(output, queryBookId, queryBookName, headersRow);
      let gList = [];
      gList.push(JSON.parse(JSON.stringify(multi_1)));
      gList.push(JSON.parse(JSON.stringify(multi_2)))
      this.multi = gList;
    });

  }

  // getGraphList(output: any, bookId: String, bookName: String, headersRow: any) {
  //   let csvArr = [];
  //   let count = 0;
  //   let graphList: GraphList = new GraphList();
  //   graphList.name = bookName;
  //   for (let i = 1; i < output.length; i++) {
  //     let curruntRecord = (<string>output[i]).split(',');
  //     if (curruntRecord.length == headersRow.length && (curruntRecord[1].trim() == bookId.trim())) {
  //       //if(count == 1000){
  //       // break;
  //       //}
  //       //else{
  //       // count = count + 1;
  //       let graphData: GraphData = new GraphData();
  //       graphData.name = curruntRecord[0].trim();
  //       graphData.value = curruntRecord[2].trim();
  //       const myObjStr = JSON.parse(JSON.stringify(graphData));
  //       csvArr.push(myObjStr);
  //       //} 
  //     }
  //   }
  //   graphList.series = csvArr;
  //   return graphList;
  // }

  getGraphList(output: any, bookId: String, bookName: String, headersRow: any) {
    let csvArr = [];
    let count = 0;
    let graphList: GraphList = new GraphList();
    graphList.name = bookName;
    for (let i = 1; i < output.length; i++) {
      let curruntRecord = (<string>output[i]).split(';');
      if (curruntRecord.length == headersRow.length && (curruntRecord[0].trim() == bookId.trim())) {
        let count = 0;
        var obj = (<string>output[i]).split(';').reduce((result, token) => {
          let graphData: GraphData = new GraphData();
          graphData.name = count;
          graphData.value = token;
          const myObjStr = JSON.parse(JSON.stringify(graphData));
          count = count + 1;
          if (graphData.name != 0) {
            csvArr.push(myObjStr);
          }
          return myObjStr;
        }, {});
      }
    }
    graphList.series = csvArr;
    return graphList;
  }

  public getTopics(): Observable<any> {
    return this.http.get(this.topicsURL, { responseType: 'text' });
  }

  getTopicsList(output: any, queryBookId: String, currentBookID: String) {
    let clouddataList = [];
    let color: string;
    for (let i = 1; i < output.length; i++) {
      let curruntRecord = (<string>output[i]).split(',');
      if (curruntRecord[0].trim() == currentBookID.trim()) { color = "#6b8e23" }
      if (curruntRecord[0].trim() == queryBookId.trim()) { color = "#191970" }
      if ((curruntRecord[0].trim() == queryBookId.trim()) || (curruntRecord[0].trim() == currentBookID.trim())) {
        for (let k = 1; k < curruntRecord.length; k++) {
          let wordArray = curruntRecord[k].split(' ');
          for (let j = 0; j < wordArray.length; j++) {
            let cloudData: WordCloudData = new WordCloudData();
            cloudData.text = wordArray[j].trim();
            cloudData.weight = 10 - j;
            cloudData.color = color;
            const myObjStr = JSON.parse(JSON.stringify(cloudData));
            clouddataList.push(myObjStr);
          }

        }

      }
    }
    return clouddataList;
  }
}



