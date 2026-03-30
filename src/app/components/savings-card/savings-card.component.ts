import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-savings-card',
  templateUrl: './savings-card.component.html',
  styleUrls: ['./savings-card.component.css']
})
export class SavingsCardComponent implements OnInit {

  @Input() savings!: number;

  constructor() { }

  ngOnInit(): void {
  }

}
