import { createBrowserClient, type SupabaseClient } from "supabase-auth-helpers-qwik";
class BrowserClient {
    supabase: SupabaseClient;
    constructor() {
        this.supabase = createBrowserClient(
            import.meta.env.PUBLIC_SUPABASE_URL,
            import.meta.env.PUBLIC_SUPABASE_ANON_KEY
        );
    }
    async send_file(table: string, destination: string, file: any, fileType: string) {
        const { error, data } = await this.supabase.storage.from(table).upload(destination, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: fileType,
        });
        return { error: error, data: data };
    }

    async sign_out() {
        const res = await this.supabase.auth.signOut();
        return res;
    }
}

export default BrowserClient;
