import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SimulationListComponent } from './components/simulation-list/simulation-list.component';
import { HeaderComponent } from './components/header/header.component';
import { TheoryComponent } from './components/theory/theory.component';
import { SimPanelComponent } from './components/sim-panel/sim-panel.component';
import { TitrationComponent } from './components/titration/titration.component';

import { AppComponent } from './app.component';
import { EfphMainComponent } from './components/efph-main/efph-main.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { InteractionService } from './services/interaction.service';
import { RouteService } from './services/route-service/route.service';

import { DemoMaterialModule } from './material-module';
import { TitrationChartComponent } from './components/titration-chart/titration-chart.component'

import { MatTableModule } from '@angular/material/table';
import { EquationsComponent } from './components/equations/equations.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulationListComponent,
    HeaderComponent,
    TheoryComponent,
    SimPanelComponent,
    TitrationComponent,
    EfphMainComponent,
    LineChartComponent,
    TitrationChartComponent,
    EquationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    MatTableModule
  ],
  entryComponents: [
  ],
  providers: [
    InteractionService,
    RouteService
  ],
  bootstrap: [
    AppComponent, 
    LineChartComponent,
  ]
})
export class AppModule { }
