import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';
import { VarsService } from 'src/app/services/local/vars.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [DatePipe]
})
export class HomePageComponent implements OnInit, OnDestroy {

  transactionList: any;
  groceryTotalExpense: any = 0;
  transportationTotalExpense: any = 0;
  restaurantTotalExpense: any = 0;
  shoppingTotalExpense: any = 0;
  telcoTotalExpense: any = 0;

  grandTotal: number = 0;
  private destroy$ = new Subject<void>();

  categoryList: any = [
    {icon: 'shopping_cart', category: 'Grocery', expense: this.groceryTotalExpense, status: 'Normal'},
    {icon: 'commute', category: 'Transportation', expense: this.transportationTotalExpense, status: 'Bad'},
    {icon: 'restaurant', category: 'Restaurant', expense: this.restaurantTotalExpense, status: 'Bad'},
    {icon: 'sell', category: 'Shopping', expense: this.shoppingTotalExpense, status: 'Good'},
    {icon: 'signal_cellular_alt', category: 'Telco', expense: this.telcoTotalExpense, status: 'Normal'}
  ]

  constructor(private supabaseService: SupabaseService, public vars: VarsService, private datePipe: DatePipe) { }

  async ngOnInit() {
    await this.supabaseService.loadTransactions();

    this.supabaseService.transactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions) => {
        if (transactions && transactions.length > 0) {
          const startDate = new Date(this.vars.todaysDate.getFullYear(), this.vars.todaysDate.getMonth(), 1);
          const endDate = new Date(this.vars.todaysDate.getFullYear(), this.vars.todaysDate.getMonth() + 1, 0);

          const filtered = transactions.filter(t => {
            const itemDate = new Date(t.created_at);
            return itemDate >= startDate && itemDate <= endDate;
          });

          const filteredToday = transactions.filter(t => {
            return this.datePipe.transform(t.created_at, 'yyyy-MM-dd') === this.datePipe.transform(this.vars.todaysDate, 'yyyy-MM-dd');
          });

          this.vars.transactionSummaryDatasource.data = filteredToday;

          this.calculateExpenses(filtered);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateExpenses(transactions: any[]) {
    const map = new Map<string, number>();
    const countMap = new Map<string, number>();

    for (const t of transactions) {
      const cat = t.category.trim().toLowerCase();
      map.set(cat, (map.get(cat) || 0) + t.price);

      // new count logic
      countMap.set(cat, (countMap.get(cat) || 0) + 1);
    }

    this.categoryList = this.categoryList.map((c: any) => ({
      ...c,
      expense: map.get(c.category.toLowerCase()) || 0
    }));

    this.grandTotal = this.categoryList.reduce((sum: number, c: any) => {
      return sum + (c.expense || 0);
    }, 0);

    const totalCount = transactions.length;

    // Step 2: update category list with BOTH values
    this.categoryList = this.categoryList.map((c: any) => {
    const key = c.category.trim().toLowerCase();
    const expense = map.get(key) || 0;
    const count = countMap.get(key) || 0;

    return {
      ...c,
      expense: expense,
      count: count,

      // ✅ count-based %
      percentage: totalCount > 0
        ? ((count / totalCount) * 100).toFixed(2)
        : 0,

      // ✅ expense-based %
      expensePercentage: this.grandTotal > 0
        ? ((expense / this.grandTotal) * 100).toFixed(2)
        : 0
      };
    });

    this.vars.categoryPercentage = this.categoryList;
  }

}
