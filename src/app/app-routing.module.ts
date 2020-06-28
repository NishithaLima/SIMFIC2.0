import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GraphAnalysisComponent } from './graph-analysis/graph-analysis.component';

const routes: Routes = [
  { path: 'graph', component: GraphAnalysisComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
