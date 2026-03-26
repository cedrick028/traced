import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { TransactionPageComponent } from './pages/transaction-page/transaction-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'statistics', component: StatisticsPageComponent},
  {path: 'transaction', component: TransactionPageComponent},
  {path: 'account', component: AccountPageComponent},
  {path: 'settings', component: SettingsPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
