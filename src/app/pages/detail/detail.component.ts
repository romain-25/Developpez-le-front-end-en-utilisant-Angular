import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {iOlympic} from "../../core/models/Olympic";
import {iParticipation} from "../../core/models/Participation";
import {LineData, LineDataSerie} from "../../core/models/LineData";
import {Location} from '@angular/common';
import {map, Observable, of, Subscription, switchMap, take} from "rxjs";
import {catchError, tap} from "rxjs/operators";

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
export class DetailComponent implements OnInit{
  multi: LineData[] = [];
  olympic!: iOlympic;
  xAxisLabel: string = 'Date';
  stringCountry: string = '';
  nbrMedals: number = 0;
  nbrAthletes: number = 0;
  countEntites: number = 0;
  subscription!: Subscription;
  olympicService: OlympicService = inject(OlympicService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  location: Location = inject(Location);

  ngOnInit(): void{
    this.stringCountry = this.route.snapshot.params['name'];
    this.subscription =  this.getCountryAndCount(this.stringCountry).pipe(
      take(1)
    ).subscribe((data: LineData[]): void => {
      this.multi = data;
    });
  }
  /**
   * Generates data for a line chart and calculates total entities, athletes, and medals for the selected country.
   * Redirects to the home page if the selected country is not found in the Olympics data.
   * @param country - The name of the selected country.
   * @returns An Observable of line chart data.
   */
  getCountryAndCount(country: string): Observable<LineData[]> {
    return this.olympicService.getOlympics().pipe(
      switchMap((arrOlympics: iOlympic[] | undefined) => {
        if (arrOlympics) {
          // Filter Olympics based on the selected country
          return of(arrOlympics.filter((olympic: iOlympic): boolean => olympic.country === country));
        } else {
          return of([]);
        }
      }),
      tap((filteredOlympics: iOlympic[]): void => {
        // If filtered Olympics array is empty, redirect to home
        if (filteredOlympics.length === 0) {
          this.router.navigate(['not-found']);
        }
      }),
      map((filteredOlympics: iOlympic[]) =>
        filteredOlympics.map((olympic: iOlympic): LineData => {
          // Calculate total entities, athletes, and medals for the selected country
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
      ),
      catchError((error: any, caught: Observable<LineData[]>) => {
        console.error(error);
        return caught;
      })
    );
  }
  /**
   * Navigates back to the previous page.
   */
  buttonBack(): void {
    this.location.back();
  }
}

