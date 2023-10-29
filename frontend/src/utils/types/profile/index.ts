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
