import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qmgimfvicwtsucpdjkyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZ2ltZnZpY3d0c3VjcGRqa3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDQ1NzQsImV4cCI6MjA4OTgyMDU3NH0.p7dXSJyaFZcZ_3n9bywrBh6c6i5tcJs9cWG0AJBa7AU';

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
