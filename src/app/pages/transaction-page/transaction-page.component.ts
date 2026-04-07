import { Component, OnDestroy, OnInit } from '@angular/core';
import { VarsService } from 'src/app/services/local/vars.service';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, ChartOptions, ChartData, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-transaction-page',
  templateUrl: './transaction-page.component.html',
  styleUrls: ['./transaction-page.component.css']
})
export class TransactionPageComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  public doughnutChartType: ChartType = 'doughnut';

  categoryValue: number[] = [];


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
    this.categoryValue = this.vars.categoryPercentage.map((item: any) => Number(item.percentage));

    // Reassign chart data object so ng2-charts detects and re-renders.
    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data: [...this.categoryValue],
        }
      ]
    };
  }

  get totalValue(): number {
    return this.categoryValue.reduce((a, b) => a + b, 0);
  }

  // Chart data
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Grocery', 'Transportation', 'Restaurant', 'Shopping', 'Telco'],
    datasets: [
      {
        data: this.categoryValue,
        backgroundColor: ['#86efac', '#d8b4fe', '#f9a8d4', '#93c5fd', '#5eead4'], // segment colors
        hoverBackgroundColor: ['#86efac60', '#d8b4fe60', '#f9a8d460', '#93c5fd60', '#5eead460'], // hover colors
        borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff' ],
        hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff' ],
        borderWidth: 1, // border width
        hoverOffset: 1, // offset when hovering
        borderRadius: 10,
        spacing: 6,
      }
    ]
  };

  // Chart options for styling
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    layout: {
      padding: {
        bottom: 10
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
        labels: {
          color: '#333', // legend text color
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 12,
          boxWidth: 10,
          boxHeight: 10,
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            return context.label + ': AED ' + context.formattedValue ;
          }
        }
      }
    },
    cutout: '75%', // inner radius (creates doughnut hole)
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  public doughnutCenterTextPlugin = {
    id: 'doughnutCenterText',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea } = chart;

      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();

      // Main text (e.g. total)
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`AED ${this.totalValue}`, centerX, centerY);

      // Optional sub text
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('Total', centerX, centerY + 20);

      ctx.restore();
    }
  };

}
