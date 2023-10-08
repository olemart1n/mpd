import { createContextId } from "@builder.io/qwik";
import { type User } from "supabase-auth-helpers-qwik";
export interface App {
    navIconLoading: boolean;
    user: User | null;
}

export const appContext = createContextId<App>("appState");
