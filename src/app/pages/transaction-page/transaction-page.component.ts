import { Component, OnDestroy, OnInit } from '@angular/core';
import { VarsService } from 'src/app/services/local/vars.service';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-page',
  templateUrl: './transaction-page.component.html',
  styleUrls: ['./transaction-page.component.css']
})
export class TransactionPageComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(private supabaseService: SupabaseService, public vars: VarsService) { }

  ngOnDestroy(): void {
    this.vars.displayTableFilter = false;
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    this.vars.displayTableFilter = true;
    await this.supabaseService.ensureTransactionsLoaded();

    this.supabaseService.transactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions) => {
        if (transactions && transactions.length > 0) {
          this.vars.transactionDatasource.data = transactions;
          this.calculateCategoryPercentages(transactions);
        }
      });
  }

  calculateCategoryPercentages(transactions: any[]) {
    const map = new Map<string, number>();
    const countMap = new Map<string, number>();

    for (const t of transactions) {
      const cat = t.category.trim().toLowerCase();
      map.set(cat, (map.get(cat) || 0) + t.price);
      countMap.set(cat, (countMap.get(cat) || 0) + 1);
    }

    const categories = ['grocery', 'transportation', 'restaurant', 'shopping', 'telco'];
    const totalPrice = Array.from(map.values()).reduce((sum: number, val: number) => sum + val, 0);
    const totalCount = transactions.length;

    const categoryPercentages = categories.map(cat => {
      const count = countMap.get(cat) || 0;
      const categoryIndex = categories.indexOf(cat);
      const categoryName = ['Grocery', 'Transportation', 'Restaurant', 'Shopping', 'Telco'][categoryIndex];

      return {
        category: categoryName,
        count: count,
        percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : 0
      };
    });

    this.vars.categoryPercentage = categoryPercentages;
  }

}
