import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {iParticipation} from "../../../../core/models/Participation";
import {AsyncPipe} from "@angular/common";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {iCountry} from "../../../../core/models/Olympic";
import {OlympicService} from "../../../../core/services/olympic.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    NgxChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  olympics$!: Observable<iCountry[]>;
  single!: any[];
  view: number[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  country: iCountry[] = [];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private olympicService: OlympicService){
    this.olympics$ = this.olympicService.getOlympics()
    setTimeout((): void=>{
      this.olympicService.getOlympics().subscribe((result:iCountry[]): void=>{
        this.country = result
      })
      this.single = this.generateDataPie()
    }, 1)
  }
  generateDataPie(): { name: string, value: number }[] {
          let pieChartData: { name: string, value: number }[] = [];
          this.country.forEach((country: iCountry): void => {
            let medalsCount : number = 0;
            country.participations.forEach((participation: iParticipation): void => {
              medalsCount += participation.medalsCount
            });
            pieChartData.push({
              name: country.country,
              value: medalsCount
            });
          });
          return pieChartData;
  }
  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }
  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
