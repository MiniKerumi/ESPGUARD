import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwwbqyflplvrbjcccfqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3d2JxeWZscGx2cmJqY2NjZnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTI5MDUsImV4cCI6MjA5MzM4ODkwNX0.0lSHq-P8pahY7BO-qvO10Y-v8lcKkmgeYvSMwuOoCPM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AuthorizedNfc {
  id: string;
  uid: string;
  name: string;
  status: 'ACTIVE' | 'BLOCKED';
  created_at?: string;
}

export interface EspguardLog {
  id: string;
  event_type: string;
  uid: string | null;
  device: string | null;
  timestamp: string;
}
