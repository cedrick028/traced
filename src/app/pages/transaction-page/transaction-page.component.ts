import { Component, OnDestroy, OnInit } from '@angular/core';
import { VarsService } from 'src/app/services/local/vars.service';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';

@Component({
  selector: 'app-transaction-page',
  templateUrl: './transaction-page.component.html',
  styleUrls: ['./transaction-page.component.css']
})
export class TransactionPageComponent implements OnInit, OnDestroy {

  constructor(private supabaseService: SupabaseService, public vars: VarsService) { }

  ngOnDestroy(): void {
    this.vars.displayTableFilter = false;
  }

  async ngOnInit() {
    this.vars.displayTableFilter = true;
    const data = await this.supabaseService.getAll('transactions')
    this.vars.transactionDatasource.data = data;
  }

}
