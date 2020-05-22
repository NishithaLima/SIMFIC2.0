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
        return this.http.post<String>(apiUrl+"userClickData", userEvent);
      }


      downloadFile()
      {
          let fileUrl :String;
        var data = 'some data here...',
        blob = new Blob([data], { type: 'text/plain' }),
        url = window.URL || window.webkitURL;
        fileUrl = url.createObjectURL(blob);
      }
}