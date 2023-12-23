import { createContextId } from "@builder.io/qwik";
export interface ProfileInterface {
    id: string | null;
    updated_at: string | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    gender: string | null;
    email: string | null;
    avatar: string | null;
    age: string | null;
    attended_groups: AttendedGroups[] | null;
}

interface AttendedGroups {
    title: string | null;
    id: string | null;
}
export interface App {
    navIconLoading: boolean;
    profile: ProfileInterface | null;
    dialogOpen: boolean;
    isNewProfileData: boolean;
}

export const appContext = createContextId<App>("appState");
