import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute} from "@angular/router";
import {iOlympic} from "../../core/models/Olympic";
import {iParticipation} from "../../core/models/Participation";
import {LineData, LineDataSerie} from "../../core/models/LineData";
import {Location} from '@angular/common';
import {map, Observable, Subscription, take} from "rxjs";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgxChartsModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy{
  multi: any[] = [];
  olympic!: iOlympic;
  xAxisLabel: string = 'Date';
  stringCountry: string = '';
  nbrMedals: number = 0;
  nbrAthletes: number = 0;
  countEntites: number = 0;
  subscription!: Subscription;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private location: Location) {};

  ngOnInit(): void{
    this.stringCountry = this.route.snapshot.params['name'];
    this.subscription =  this.getCountryAndCount(this.stringCountry).pipe(
      take(1)
    ).subscribe((data: LineData[]): void => {
      this.multi = data;
    });
  }
  // Generate data for line chart and calculate entities, athletes and medals
  getCountryAndCount(country: string): Observable<LineData[]> {
    return this.olympicService.getOlympics().pipe(
      map((arrOlympics: iOlympic[]) =>
        arrOlympics
          .filter((olympic: iOlympic): boolean => olympic.country === country)
          .map((olympic: iOlympic): LineData => {
            this.countEntites = olympic.participations.length;
            const series: LineDataSerie[] = olympic.participations.map((participation: iParticipation): LineDataSerie => {
              this.nbrAthletes += participation.athleteCount;
              this.nbrMedals += participation.medalsCount;
              return {
                name: String(participation.year),
                value: participation.medalsCount
              };
            });
            return {
              name: olympic.country,
              series,
            };
          })
      )
    );
  }
  buttonBack(): void {
    this.location.back();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

