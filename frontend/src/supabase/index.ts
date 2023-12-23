import { createServerClient } from "supabase-auth-helpers-qwik";
import { type RequestEvent } from "@builder.io/qwik-city";
export function createSupabaseClient(reqEv: RequestEvent) {
    return createServerClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        reqEv
    );
}
