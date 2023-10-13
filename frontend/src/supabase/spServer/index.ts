import { createServerClient, type SupabaseClient } from "supabase-auth-helpers-qwik";
import { type RequestEvent, type RequestEventAction } from "@builder.io/qwik-city";
import { type SignInWithPasswordCredentials } from "@supabase/supabase-js";

class SpServer {
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
    async get_by_id(table: string, id: string) {
        const { data, error } = await this.supabase.from(table).select("*").eq("id", id);
        return { data, error };
    }
    async add_interest(table: string, values: [] | {}) {
        const { data, error } = await this.supabase.from(table).insert(values).select();
        return { data, error };
    }
    async get_all_interested(id: string | {}) {
        const { data, error } = await this.supabase
            .from("interested")
            .select("*")
            .eq("initiative_id", id)
            .order("created_at", { ascending: false });
        return { data, error };
    }
    channel_initiatives() {
        const channel = this.supabase
            .channel("initiatives_channel")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "initiatives" },
                (event) => {
                    console.log(event);
                }
            )
            .subscribe();
        return channel;
    }
    channel_interested(id: string | {}) {
        function hasInitiativeId(newInterest: any): newInterest is { initiative_id: number } {
            return "initiative_id" in newInterest;
        }
        const channel = this.supabase
            .channel("interested_channel")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "interested" },
                (event) => {
                    const { new: newInterest } = event;

                    if (hasInitiativeId(newInterest) === id) return newInterest;
                    // if (newInterest.initiative_id === id) return newInterest;
                }
            )
            .subscribe();
        return channel;
    }
}

export default SpServer;
