import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://fbldpvpdmvtrfxdslfba.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibGRwdnBkbXZ0cmZ4ZHNsZmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NDgyOTksImV4cCI6MjA1NTUyNDI5OX0.GPSOi9oEtTJZ3qmRsJUbVKYvAU2L2i-iwkHzFFOqVZ0';

    if (!supabaseUrl) {
      console.error('Supabase URL is not defined');
    }
    if (!supabaseKey) {
      console.error('Supabase Key is not defined');
    }

    export const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });
