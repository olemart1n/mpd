import { createContextId } from "@builder.io/qwik";
import { type ProfileInterface } from "~/utils";
export interface App {
    navIconLoading: boolean;
    profile: ProfileInterface | null;
    dialogOpen: boolean;
    isNewProfileData: boolean;
}

export const appContext = createContextId<App>("appState");
