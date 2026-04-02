import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supbase-service/supabase.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  displayName = '';
  phone = '';

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  ngOnInit(): void {
  }

  async onSignup() {
    this.loading = true;
    this.errorMessage = '';

    try {
      const res = await this.supabaseService.signUp(
        this.email,
        this.password,
        {
          display_name: this.displayName,
          phone: this.phone
        }
      );

      // Supabase v1: user may need email confirmation
      if (res.session) {
        this.router.navigate(['/']); // auto login
      } else {
        // fallback (email confirmation case)
        alert('Signup successful! Please check your email.');
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Signup failed';
    } finally {
      this.loading = false;
    }
  }

}
