import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://suvatllmnsanpwpbnsec.supabase.co";

const supabaseKey = "sb_publishable_41f2y64YoqCDdFlNF54psA_JCrus3tv";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);