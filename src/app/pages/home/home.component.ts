import {Component, inject, OnInit} from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {iOlympic} from "../../core/models/Olympic";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<iOlympic[] | null> = of(null);
  olympicService:OlympicService = inject(OlympicService)

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
