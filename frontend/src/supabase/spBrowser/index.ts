import { createBrowserClient, type SupabaseClient } from "supabase-auth-helpers-qwik";
class SpBrowser {
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

export default SpBrowser;

// channel_initiatives() {
//     this.supabase
//         .channel("initiatives_channel")
//         .on(
//             "postgres_changes",
//             { event: "*", schema: "public", table: "initiatives" },
//             (event) => {
//                 console.log(event);
//                 return event;
//             }
//         )
//         .subscribe();
// }
// channel_interested(id: string | {}) {
//     function hasInitiativeId(newInterest: any): newInterest is { initiative_id: number } {
//         return "initiative_id" in newInterest;
//     }
//     const channel = this.supabase
//         .channel("interested_channel")
//         .on(
//             "postgres_changes",
//             { event: "*", schema: "public", table: "interested" },
//             (event) => {
//                 const { new: newInterest } = event;

//                 if (hasInitiativeId(newInterest) === id) return newInterest;
//                 // if (newInterest.initiative_id === id) return newInterest;
//             }
//         )
//         .subscribe();
//     return channel;
// }
