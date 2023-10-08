import { createServerClient, type SupabaseClient } from "supabase-auth-helpers-qwik";
import { type RequestEvent, type RequestEventAction } from "@builder.io/qwik-city";
import { type SignInWithPasswordCredentials } from "@supabase/supabase-js";

class SpServerClass {
    supabase: SupabaseClient;
    constructor(reqEv: RequestEvent | RequestEventAction) {
        this.supabase = createServerClient(
            import.meta.env.PUBLIC_SUPABASE_URL,
            import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
            reqEv
        );
    }

    async sign_in(credentials: SignInWithPasswordCredentials) {
        const { error, data } = await this.supabase.auth.signInWithPassword(credentials);
        return { error: error, data: data };
    }
    async sign_up(credentials: SignInWithPasswordCredentials) {
        const { error, data } = await this.supabase.auth.signUp(credentials);
        return { error: error, data: data };
    }

    async log_out() {
        const { error } = await this.supabase.auth.signOut();
        return { error };
    }

    async get_session() {
        const data = await this.supabase.auth.getSession();
        return data;
    }
    async get_user() {
        const { data: user, error } = await this.supabase.auth.getUser();

        return { user, error };
    }

    async post(table: string, postData: object) {
        const { data, error } = await this.supabase.from(table).insert(postData);
        return { data, error };
    }
    async get_initiatives_desc(table: string) {
        const { data, error } = await this.supabase
            .from(table)
            .select("*")
            .order("created_at", { ascending: false });
        return { data, error };
    }
    async get_by_id(id: string, table: string) {
        const { data, error } = await this.supabase.from(table).select(id);
        return { data, error };
    }
}

export default SpServerClass;
