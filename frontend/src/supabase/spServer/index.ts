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
        if (error) console.log(error);
        return { error: error, data: data };
    }

    async log_out() {
        const { error } = await this.supabase.auth.signOut();
        if (error) console.log(error);
        return { error };
    }

    async refresh_session() {
        await this.supabase.auth.refreshSession();
    }
    async get_session() {
        return await this.supabase.auth.getSession();
    }

    // async get_user() {
    //     const { data: user, error } = await this.supabase.auth.getUser();
    //     if (error) console.log(error);
    //     return { user, error };
    // }

    async get_by_id(table: string, id: string) {
        const { data, error } = await this.supabase.from(table).select("*").eq("id", id).single();
        if (error) console.log(error);
        return { data, error };
    }
    async get_joined_groups(id: string) {
        const { data, error } = await this.supabase
            .from("group_attendees")
            .select("group_id, group_name: groups(name)")
            .eq("profile_id", id);
        if (error) console.log(error);
        return { data, error };
    }
    async get_profile(id: string) {
        const { data, error } = await this.supabase
            .from("profiles")
            .select("*, imdown(initiatives(title, groups(id)))")
            .eq("id", id)
            .single();
        if (error) console.log(error);
        return { data, error };
    }

    async post(table: string, postData: object) {
        const { data, error } = await this.supabase.from(table).insert(postData);
        if (error) console.log(error);
        return { data, error };
    }

    async get_initiatives_desc() {
        const { data, error } = await this.supabase
            .from("initiatives")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) console.log(error);
        return { data, error };
    }
    async get_user_initiatives_desc(profile_id: string) {
        const { data, error } = await this.supabase
            .from("groups")
            .select("*,initiatives:initiative_id(*), attendees: group_attendees(*)")
            .eq("author_id", profile_id)
            .order("created_at", { ascending: false });
        if (error) console.log(error);

        return { data, error };
    }
    async get_group(group_id: string) {
        const { data, error } = await this.supabase
            .from("groups")
            .select(
                "*, attendees: group_attendees(*, profile: profile_id(*)), messages: group_messages(*), initiative: initiative_id(*, profiles(age))"
            )
            .eq("id", group_id)
            .single();
        if (error) console.log(error);
        return { data, error };
    }
    async get_group_messages(group_id: string) {
        const { data, error } = await this.supabase
            .from("group_messages")
            .select("*")
            .eq("group_id", group_id);
        if (error) console.log(error);
        return { data, error };
    }

    async get_initiative(postId: string) {
        const { data, error } = await this.supabase
            .from("initiatives")
            .select(`*, author_id(*), interested: interested(*), imDown: imdown(*), groups(*)`)
            .eq("id", postId)
            .single();
        if (error) console.log(error);
        return { data, error };
    }

    async set_interest(values: [] | {}) {
        const { data, error } = await this.supabase.from("interested").insert(values).select();
        if (error) console.log(error);
        console.log(data);
        return { data, error };
    }
    async set_imDown(values: [] | {}) {
        const { data, error } = await this.supabase.from("imdown").insert(values).select();
        if (error) console.log(error);

        return { data, error };
    }
    async cancel_interest(id: string, iId: string) {
        const { data, error } = await this.supabase
            .from("interested")
            .delete()
            .eq("profile_id", id)
            .eq("initiative_id", iId);
        if (error) console.log("error updating row :" + error);
        return { data, error };
    }
}

export default SpServer;
