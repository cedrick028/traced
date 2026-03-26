import { Injectable } from '@angular/core';
import { supabase } from '../../supabase.client';
import { Transaction } from 'src/app/interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor() { }

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
