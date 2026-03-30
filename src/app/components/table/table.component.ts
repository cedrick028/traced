import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VarsService } from 'src/app/services/local/vars.service';
import { DatePipe } from '@angular/common';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [DatePipe]
})
export class TableComponent implements AfterViewInit {

  @Input() dataSource: any;
  @Input() displayedColumns: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filteredToday: boolean = false;

  constructor(private supabaseService: SupabaseService, public vars: VarsService, private datePipe: DatePipe) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.dataSource.paginator?.firstPage();
  }

  filterTodaysTransaction() {
    this.filteredToday = true;
    this.dataSource.data = this.dataSource.data.filter((date: any) => {
      return this.datePipe.transform(date.created_at, 'yyyy-MM-dd') === this.datePipe.transform(this.vars.todaysDate, 'yyyy-MM-dd')
    })
  }

  async resetTodaysTransactionFilter() {
    this.filteredToday = false;
    return this.dataSource.data = await this.supabaseService.getAll('transactions');
  }
}
