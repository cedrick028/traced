import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/interfaces/transaction';
import { VarsService } from 'src/app/services/local/vars.service';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {

  productName!: string;
  productPrice!: number;
  productCategory!: string;

  constructor(private supabaseService: SupabaseService, private vars: VarsService, private dialogRef: MatDialogRef<NewTransactionComponent>) { }

  ngOnInit(): void {

  }

  async addNewTransaction() {
    const newTransaction: any = {
      product: this.productName,
      price: this.productPrice,
      category: this.productCategory,
      created_at: new Date().toISOString()
    }

    if (this.productPrice && this.productCategory) {
      const holdTransaction = await this.supabaseService.insert('transactions', newTransaction);
      this.dialogRef.close(holdTransaction);
    }
  }

}
