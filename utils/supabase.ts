import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";

const options: SupabaseClientOptions = {
  schema: "public",
  headers: { "x-my-custom-header": "my-app-name" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

export const supabase = createClient(
  "https://wnsnbgvlilyzgxenjshm.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY as string,
  options
);
