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

  constructor() { }

  // Load transactions dynamically and update the subject
  async loadTransactions() {
    const data = await this.getAll('transactions');
    this.transactionsSubject.next(data);
    return data;
  }

  // SELECT
  async getAll(table: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*');

    if (error) throw error;
    return data;
  }

  // INSERT
  async insert(table: string, payload: any): Promise<Transaction> {
    const { data, error } = await supabase
      .from(table)
      .insert([payload]);

    if (error) throw error;

    // Update the transactions subject if adding to transactions table
    if (table === 'transactions') {
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
}
