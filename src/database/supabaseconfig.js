import { createClient } from "/node_modules/.vite/deps/@supabase_supabase-js.js?v=a6e852f3";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);