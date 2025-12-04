import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqufxqizrupbxwobqvfp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdWZ4cWl6cnVwYnh3b2JxdmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODc1ODgsImV4cCI6MjA4MDM2MzU4OH0.sbO4Z8MXrN7vM2rlh-AxMNucSIopn97-XvC9HqhUjxs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);