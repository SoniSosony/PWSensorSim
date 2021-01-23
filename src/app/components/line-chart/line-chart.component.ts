import { Component, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { phMeter } from '../../classes/phMeter';
import { InteractionService } from '../../services/interaction.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  data: any[];
  view: any[] = [700, 300];

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'pH';
  yAxisLabel: string = 'Voltage [mV]';


  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private share: InteractionService) { 
    this.share.newEfphData.subscribe((data: any) => {
      this.data = data;
      this.data = [...this.data];
    });

    this.data = [
      {
        'name': 'pH',
        'series': [
          {
            'name': 0,
            'value': 0
          }
        ]
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
