import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ipoyqpdhkjaabrgwmfak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3lxcGRoa2phYWJyZ3dtZmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjIzNzEsImV4cCI6MjA3MTMzODM3MX0._yjOEHlKKfKsHNkcKkps669DVj88Mbu5LBrn0GspLFI';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;