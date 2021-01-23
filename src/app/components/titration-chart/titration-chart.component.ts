import { Component, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InteractionService } from '../../services/interaction.service';

@Component({
  selector: 'app-titration-chart',
  templateUrl: './titration-chart.component.html',
  styleUrls: ['./titration-chart.component.scss']
})
export class TitrationChartComponent implements OnInit {

  data: any[];
  view: any[] = [700, 300];

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'V [dm3]';
  yAxisLabel: string = 'V [V]';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private share: InteractionService) { 
    this.share.newTitrationData.subscribe((data: any) => {
      this.data = data;
      this.data = [...this.data];
    });

    this.data = [
      {
        'name': 'pH',
        'series': []
      }
    ];
    let data = this.data;
    Object.assign(this, { data });
   }

  ngOnInit(): void {
  }

  onSelect(data: any): void {
  }

  onActivate(data: any): void {
  }

  onDeactivate(data: any): void {
  }

  updateChart(){

  }

}
