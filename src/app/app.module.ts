import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,APP_INITIALIZER} from '@angular/core';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {AppRoutingModule } from './app-routing.module';
import { ConfigService } from './search.service';
import { AppComponent } from './app.component';
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
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export function initConfig(appConfig: ConfigService) {
  return () => appConfig.load();
  }

@NgModule({
  declarations: [
    AppComponent  
  ],
  entryComponents: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutocompleteLibModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatBadgeModule,
    MatButtonToggleModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    BrowserAnimationsModule ,
    MatProgressBarModule
  ],
  providers: [
    ConfigService, { provide: APP_INITIALIZER, useFactory: initConfig, deps: [ConfigService], multi: true },
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }
