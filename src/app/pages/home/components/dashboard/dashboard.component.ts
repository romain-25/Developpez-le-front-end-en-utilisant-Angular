import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {iParticipation} from "../../../../core/models/Participation";
import {AsyncPipe} from "@angular/common";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {iCountry} from "../../../../core/models/Olympic";
import {OlympicService} from "../../../../core/services/olympic.service";
import {Router} from "@angular/router";
import {iPieDate} from "../../../../core/models/PieData";

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
  single!: iPieDate[];

  // options
  gradient: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  country: iCountry[] = [];

  constructor(private olympicService: OlympicService, private router: Router){
    this.olympics$ = this.olympicService.getOlympics()
    setTimeout((): void=>{
      this.olympicService.getOlympics().subscribe((result:iCountry[]): void=>{
        this.country = result
      })
      this.single = this.generateDataPie()
    }, 1)
  }
  generateDataPie(): iPieDate[] {
          let pieChartData: iPieDate[] = [];
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
    this.router.navigateByUrl('detail')
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
}
