import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { supabase } from '../../supabase.client';
import { Transaction } from 'src/app/interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private transactionsSubject = new BehaviorSubject<any[]>([]);
  transactions$ = this.transactionsSubject.asObservable();
  userProfile: any = null;

  constructor() { }

  // Ensure transactions are loaded (load only if not already loaded)
  async ensureTransactionsLoaded() {
    if (this.transactionsSubject.value.length === 0) {
      await this.loadTransactions();
    }
  }

  // Load transactions dynamically and update the subject
  async loadTransactions() {
    const data = await this.getAll('transactions');
    this.transactionsSubject.next(data);
    return data;
  }

  // SELECT
  async getAll(table: string) {
    const user = await this.getUser();

    if (!user) throw new Error('User not logged in.');

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  }

  // INSERT
  async insert(table: string, payload: any): Promise<Transaction> {
    const user = await this.getUser();

    if (!user) throw new Error('User not logged in.')

    payload.user_id = user.id;

    const { data, error } = await supabase
      .from(table)
      .insert([payload])
      .select();

    if (error) throw error;

    // Update the transactions subject if adding to transactions table
    if (table === 'transactions' && data && data.length > 0) {
      const current = this.transactionsSubject.value;
      this.transactionsSubject.next([...current, data[0]]);
    }

    return data[0]; // always return single object
  }

   // UPDATE
  async update(table: string, id: number | string, payload: any) {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq('id', id);   // change 'id' if your PK is different

    if (error) throw error;
    return data;
  }

  // DELETE
  async delete(table: string, id: number | string) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);   // change 'id' if needed

    if (error) throw error;
    return data;
  }

  // SIGN UP
  async signUp(email: string, password: string, meta?: any) {
    const { user, session, error } = await supabase.auth.signUp(
      {
        email,
        password
      },
      {
        data: meta
      }
    );

    if (error) throw error;
    return { user, session }
  }

  // LOGIN
  async signIn(email: string, password: string) {
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) throw error;
    return { user, session };
  }

  // GET CURRENT USER
  async getUser() {
    return supabase.auth.user();
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return data;
  }

  // LOGOUT
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async loadUserProfile(userId: string) {
    return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  }

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

}
