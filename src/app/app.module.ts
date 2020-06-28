import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,APP_INITIALIZER} from '@angular/core';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {AppRoutingModule } from './app-routing.module';
import { ConfigService } from './search.service';
import { AppComponent } from './app.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field'
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphAnalysisComponent } from './graph-analysis/graph-analysis.component';

export function initConfig(appConfig: ConfigService) {
  return () => appConfig.load();
  }

@NgModule({
  declarations: [
    AppComponent,
    GraphAnalysisComponent  
  ],
  entryComponents: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutocompleteLibModule,
    HttpClientModule,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatBadgeModule,
    MatButtonToggleModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    BrowserAnimationsModule ,
    MatProgressBarModule,
    NgxChartsModule
    
  ],
  providers: [
    ConfigService, { provide: APP_INITIALIZER, useFactory: initConfig, deps: [ConfigService], multi: true },
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }
