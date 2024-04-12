import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {iOlympic} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl: string = './assets/mock/olympic.json';
  private olympics$:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private http:HttpClient = inject(HttpClient);
  /**
   * Loads initial Olympic data from the JSON file.
   * @returns An Observable of the loaded Olympic data.
   */
  loadInitialData():Observable<iOlympic[]> {
    return this.http.get<iOlympic[]>(this.olympicUrl).pipe(
      tap((value:iOlympic[]) => this.olympics$.next(value)),
      catchError((error, caught:Observable<iOlympic[]>) => {
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }
  /**
   * Gets the Olympic data as an Observable.
   * @returns An Observable of the Olympic data.
   */
  getOlympics():Observable<iOlympic[]> {
    return this.olympics$.asObservable();
  }
}
