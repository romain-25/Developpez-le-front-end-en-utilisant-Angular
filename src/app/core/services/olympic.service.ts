import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {iParticipation} from "../models/Participation";
import {iCountry} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl: string = './assets/mock/olympic.json';
  private olympics$:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData():Observable<iCountry[]> {
    return this.http.get<iCountry[]>(this.olympicUrl).pipe(
      tap((value:iCountry[]) => this.olympics$.next(value)),
      catchError((error, caught:Observable<iCountry[]>) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }
  getOlympics():Observable<iCountry[]> {
    return this.olympics$.asObservable();
  }
}
