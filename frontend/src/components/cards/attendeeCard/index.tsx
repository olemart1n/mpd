import { component$ } from "@builder.io/qwik";

export interface AttendeeProps {
    profile: {
        id?: string | undefined;
        avatar: string | undefined;
        username: string | undefined;
        age: string | undefined;
    };
}

export const AttendeeCard = component$<AttendeeProps>(({ profile }: AttendeeProps) => {
    return (
        <section>
            <img width={50} height={50} src={profile.avatar}></img>
            <div>{profile.username}</div>
            <div>{profile.age}</div>
        </section>
    );
});
