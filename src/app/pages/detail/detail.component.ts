import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

}
