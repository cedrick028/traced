import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';
import { Router } from '@angular/router';
import { VarsService } from 'src/app/services/local/vars.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private supabaseService:SupabaseService, private router:Router, private vars:VarsService) { }

  async ngOnInit() {
    const user = await this.supabaseService.getUser();

    if (user) {
      this.router.navigate(['/']); // already logged in → go home
    }
  }

  async onLogin() {
    this.loading = true;
    this.errorMessage = '';

    try {
      const res = await this.supabaseService.signIn(
        this.email,
        this.password
      );

      if (res.user) {
        // redirect after login (profile will be loaded in app.component.ngOnInit)
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }

}
