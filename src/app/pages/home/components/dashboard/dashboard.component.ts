import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subscription, take} from "rxjs";
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
  ngOnInit(): void{
    this.olympics$ = this.olympicService.getOlympics();
    setTimeout((): void=>{
      this.subscription = this.getCountry().pipe(
        take(1)
      ).subscribe((data: iPieDate[]): void => {
        this.single = data;
      });
    }, 100)

  }
  // Generate data for pie chart
  getCountry(): Observable<iPieDate[]> {
    return this.olympics$.pipe(
      map((arrOlympics: iOlympic[]) => {
        if (!arrOlympics) {
          return [];
        }
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
