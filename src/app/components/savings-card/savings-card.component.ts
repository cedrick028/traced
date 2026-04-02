import { Component, OnInit, Input } from '@angular/core';
import { VarsService } from 'src/app/services/local/vars.service';

@Component({
  selector: 'app-savings-card',
  templateUrl: './savings-card.component.html',
  styleUrls: ['./savings-card.component.css']
})
export class SavingsCardComponent implements OnInit {

  @Input() savings!: number;
  hideCardDetails: boolean = false;

  constructor(public vars:VarsService) { }

  ngOnInit(): void {
  }

}
