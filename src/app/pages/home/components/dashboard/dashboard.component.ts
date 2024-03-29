import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {iParticipation} from "../../../../core/models/Participation";
import {AsyncPipe} from "@angular/common";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {iOlympic} from "../../../../core/models/Olympic";
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
  olympics$!: Observable<iOlympic[]>;
  single!: iPieDate[];
  country: iOlympic[] = [];

  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics()
    setTimeout((): void => {
      this.olympicService.getOlympics().subscribe((result: iOlympic[]): void => {
        this.country = result
      })
      this.single = this.generateDataPie()
    }, 1)
  }

  generateDataPie(): iPieDate[] {
    let pieChartData: iPieDate[] = [];
    this.country.forEach((country: iOlympic): void => {
      let medalsCount: number = 0;
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

  onSelect(data: iPieDate): void {
    this.router.navigateByUrl(`detail/${data.name}`)
  }
}
