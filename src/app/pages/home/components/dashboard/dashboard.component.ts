import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {iParticipation} from "../../../../core/models/Participation";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @Input() InputOlympics$!: Observable<any>;
}
