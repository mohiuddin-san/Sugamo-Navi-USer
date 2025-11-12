let supabaseClient = null;

const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ipoyqpdhkjaabrgwmfak.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3lxcGRoa2phYWJyZ3dtZmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjIzNzEsImV4cCI6MjA3MTMzODM3MX0._yjOEHlKKfKsHNkcKkps669DVj88Mbu5LBrn0GspLFI';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }

    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

export default getSupabase();