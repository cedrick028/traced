import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewTransactionComponent } from './components/buttons/new-transaction/new-transaction.component';
import { VarsService } from './services/local/vars.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'traced';

  navLinks: any = [
    {nav: 'Home', routerLink: '/', icon: ''},
    {nav: 'Statistics', routerLink: '/statistics', icon: ''},
    {nav: 'Transactions', routerLink: '/transaction', icon: ''},
    {nav: 'Account', routerLink: '/account', icon: ''},
    {nav: 'Settings', routerLink: '/settings', icon: ''}
  ]
  displayMenu: boolean = false;

  constructor(public dialog: MatDialog, private vars: VarsService) {}

  openDialog() {
    const dialogRef = this.dialog.open(NewTransactionComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('test',result)
      this.vars.transactionSummaryDatasource.data = [...this.vars.transactionSummaryDatasource.data, result];
      this.vars.transactionDatasource.data = [...this.vars.transactionDatasource.data, result];
    })
  }
}
