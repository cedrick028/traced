import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewTransactionComponent } from './components/buttons/new-transaction/new-transaction.component';
import { VarsService } from './services/local/vars.service';
import { SupabaseService } from './services/supbase-service/supabase.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'traced';

  navLinks: any = [
    {nav: 'Home', routerLink: '/', icon: ''},
    {nav: 'Transactions', routerLink: '/transaction', icon: ''},
    {nav: 'Account', routerLink: '/account', icon: ''}
  ]

  displayMenu: boolean = false;
  isAuthPage: boolean = false;
  loading: boolean = false;
  errorMessage = '';
  private authListener: any;

  constructor(public dialog: MatDialog, private vars: VarsService, private supabaseService:SupabaseService, private router:Router) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const url = event.urlAfterRedirects;
          this.isAuthPage =
          url.startsWith('/login') ||
          url.startsWith('/signup');

          this.displayMenu = false;
        }
    });
  }

  async ngOnInit() {
    this.authListener = this.supabaseService.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        await this.loadUserProfileIntoVars(session.user.id);
      }

      if (event === 'SIGNED_OUT') {
        this.resetUserVars();
      }
    });

    const user = await this.supabaseService.getUser();

    if (!user) {
      this.resetUserVars();
      this.router.navigate(['/login']);
      return
    }

    await this.loadUserProfileIntoVars(user.id);
  }

  ngOnDestroy(): void {
    this.authListener?.unsubscribe();
  }

  private async loadUserProfileIntoVars(userId: string) {
    const { data } = await this.supabaseService.loadUserProfile(userId);

    if (!data) {
      this.resetUserVars();
      return;
    }

    this.vars.displayName = data.display_name || '';
    this.vars.phone = data.phone || '';
    this.vars.monthlyIncome = data.monthly_income ?? 0;
    this.vars.currency = data.currency || '';
  }

  private resetUserVars() {
    this.vars.displayName = '';
    this.vars.phone = '';
    this.vars.monthlyIncome = 0;
    this.vars.currency = '';
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewTransactionComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vars.transactionDatasource.data = [...this.vars.transactionDatasource.data, result];
      }
    })
  }

  async logout() {
    this.errorMessage = "";
    this.loading = true;
    try {
      await this.supabaseService.signOut();
      this.vars.transactionDatasource.data = [];
      this.displayMenu = false;
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error: any) {
      this.errorMessage = error.message || 'Logout failed';
    } finally {
      this.loading = false;
    }
  }
}
