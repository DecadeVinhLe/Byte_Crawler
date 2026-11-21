/* Account database settings.
   Leave both values empty to keep the browser-only demo login.
   To turn on real accounts, follow supabase/SETUP.md and paste the two values here.
   The anon key is meant to be public: the database rules in supabase/schema.sql
   decide what it may do. Never paste the "service_role" key here. */
window.BC_CONFIG = {
  SUPABASE_URL: "",       // for example "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: ""   // the long "anon" / "publishable" key
};
