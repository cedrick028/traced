import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class VarsService {

  displayTableFilter: boolean = false;

  transactionSummaryDatasource = new MatTableDataSource<Transaction>([])
  transactionDatasource = new MatTableDataSource<Transaction>([])

  todaysDate: Date = new Date();

  monthlyIncome: number = 7000;
  categoryPercentage: any;

  constructor() { }
}
