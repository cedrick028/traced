import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/interfaces/transaction';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VarsService {

  displayTableFilter: boolean = false;

  transactionSummaryDatasource = new MatTableDataSource<Transaction>([])
  transactionDatasource = new MatTableDataSource<Transaction>([])

  todaysDate: Date = new Date();
  categoryPercentage: any;
  private transactionDateScopeSubject = new BehaviorSubject<'month' | 'today'>('month');
  transactionDateScope$ = this.transactionDateScopeSubject.asObservable();

  displayName: string = '';
  phone: string = '';
  monthlyIncome!: number;
  currency: string = '';

  setTransactionDateScope(scope: 'month' | 'today') {
    this.transactionDateScopeSubject.next(scope);
  }

  constructor() { }
}
