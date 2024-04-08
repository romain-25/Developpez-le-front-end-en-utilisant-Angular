import {Component, inject, OnDestroy, OnInit} from '@angular/core';
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
  olympicService: OlympicService = inject(OlympicService);
  router: Router = inject(Router);
  ngOnInit(): void {
    // Initialize Olympics data Observable
    this.olympics$ = this.olympicService.getOlympics();
    // Subscribe to initial data load and generate data for pie chart
    this.subscription = this.olympicService.loadInitialData().pipe(
    filter((olympics:iOlympic[]) => !!olympics),
    switchMap(() => this.getCountry())).subscribe((data: iPieDate[]): void => { this.single = data; });
  }
  /**
   * Generates data for the pie chart.
   * @returns An Observable of pie chart data.
   */
  getCountry(): Observable<iPieDate[]> {
    return this.olympicService.loadInitialData().pipe(
      map((arrOlympics: iOlympic[]) => {
        return arrOlympics.map((olympic: iOlympic): iPieDate => {
          // Calculate total medals count for each country
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
  /**
   * Navigates to detailed view when a pie chart segment is selected.
   * @param data - The selected pie chart data.
   */
  onSelect(data: iPieDate): void {
    this.router.navigateByUrl(`detail/${data.name}`)
  }
  /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
