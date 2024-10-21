import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL_FORMS as string;
const supabaseKey = process.env.SUPABASE_KEY_FORMS as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
