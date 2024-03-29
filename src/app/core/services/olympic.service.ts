import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {iOlympic} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl: string = './assets/mock/olympic.json';
  private olympics$:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData():Observable<iOlympic[]> {
    return this.http.get<iOlympic[]>(this.olympicUrl).pipe(
      tap((value:iOlympic[]) => this.olympics$.next(value)),
      catchError((error, caught:Observable<iOlympic[]>) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }
  getOlympics():Observable<iOlympic[]> {
    return this.olympics$.asObservable();
  }
}
