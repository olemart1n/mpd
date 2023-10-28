import { createContextId } from "@builder.io/qwik";
import { type ProfileInterface } from "~/utils";
export interface App {
    navIconLoading: boolean;
    profile: ProfileInterface | null;
    dialogOpen: boolean;
}

export const appContext = createContextId<App>("appState");
