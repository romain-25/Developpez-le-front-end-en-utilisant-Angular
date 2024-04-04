import {Component, OnDestroy, OnInit} from '@angular/core';
import {filter, map, Observable, Subscription, switchMap, take} from "rxjs";
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
export class DashboardComponent implements OnInit, OnDestroy{
  olympics$!: Observable<iOlympic[]>;
  single!: iPieDate[];
  subscription!: Subscription;
  constructor(private olympicService: OlympicService, private router: Router) {}
  ngOnInit(): void { this.subscription = this.olympicService.loadInitialData().pipe(
    filter((olympics:iOlympic[]) => !!olympics),
    switchMap(() => this.getCountry())).subscribe((data: iPieDate[]): void => { this.single = data; });
  }
  // Generate data for pie chart
  getCountry(): Observable<iPieDate[]> {
    return this.olympicService.loadInitialData().pipe(
      map((arrOlympics: iOlympic[]) => {
        return arrOlympics.map((olympic: iOlympic): iPieDate => {
          const medalsCount: number = olympic.participations.reduce((total: number, participation: iParticipation): number => {
            return total + participation.medalsCount;
          }, 0);
          return {
            name: olympic.country,
            value: medalsCount
          };
        });
      })
    );
  }
  onSelect(data: iPieDate): void {
    this.router.navigateByUrl(`detail/${data.name}`)
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
