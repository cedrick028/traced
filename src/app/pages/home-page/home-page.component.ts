import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/interfaces/transaction';
import { VarsService } from 'src/app/services/local/vars.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  transactionList: any;

  categoryList: any = [
    {icon: 'shopping_cart', category: 'Grocery', expense: '1850', status: 'Normal'},
    {icon: 'commute', category: 'Transportation', expense: '460', status: 'Bad'},
    {icon: 'restaurant', category: 'Restaurant', expense: '800', status: 'Bad'},
    {icon: 'sell', category: 'Shopping', expense: '320', status: 'Good'},
    {icon: 'signal_cellular_alt', category: 'Telco', expense: '200', status: 'Normal'},
    {icon: 'category', category: 'Others', expense: '180', status: 'Good'},
  ]

  constructor(private supabaseService: SupabaseService, public vars: VarsService) { }

  async ngOnInit() {
    const data = await this.supabaseService.getAll('transactions');
    this.vars.transactionSummaryDatasource.data = data;
  }

}
