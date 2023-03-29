import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://otczfqplhcnlproctbbi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90Y3pmcXBsaGNubHByb2N0YmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkzMzk1NzQsImV4cCI6MTk5NDkxNTU3NH0.6k-3_87W65YKpaAGw5kyZKcEfMbytZJu0OmFlZ6Jfro"
);

export { supabase };
