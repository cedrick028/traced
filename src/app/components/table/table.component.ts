import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VarsService } from 'src/app/services/local/vars.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {

  @Input() dataSource: any;
  @Input() displayedColumns: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filteredToday: boolean = false;

  constructor(public vars: VarsService) {}

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
    this.vars.setTransactionDateScope('today');
  }

  resetTodaysTransactionFilter() {
    this.filteredToday = false;
    this.vars.setTransactionDateScope('month');
  }
}
