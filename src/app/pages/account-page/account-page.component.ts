import { Component, OnInit } from '@angular/core';
import { VarsService } from 'src/app/services/local/vars.service';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {

  loading = false;

  constructor(private supabaseService:SupabaseService, public vars:VarsService) { }

  async ngOnInit() { }

  async saveProfile() {
    this.loading = true;

    try {
      const user = await this.supabaseService.getUser();
      if (!user) return;

      const updates = {
        display_name: this.vars.displayName,
        phone: this.vars.phone,
        monthly_income: this.vars.monthlyIncome,
        currency: this.vars.currency
      };

      await this.supabaseService.updateProfile(user.id, updates);
    } catch (error) {
      console.error('Failed to save profile', error);
    } finally {
      this.loading = false;
    }
  }

}
