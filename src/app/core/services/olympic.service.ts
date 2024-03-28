import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {iParticipation} from "../models/Participation";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl: string = './assets/mock/olympic.json';
  private olympics$:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData():Observable<iParticipation[]> {
    return this.http.get<iParticipation[]>(this.olympicUrl).pipe(
      tap((value:iParticipation[]) => this.olympics$.next(value)),
      catchError((error, caught:Observable<iParticipation[]>) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics():Observable<iParticipation[]> {
    return this.olympics$.asObservable();
  }
}
