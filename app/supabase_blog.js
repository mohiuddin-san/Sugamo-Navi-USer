import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_BLOG_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_BLOG_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase Blog credentials missing!");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default supabase;
