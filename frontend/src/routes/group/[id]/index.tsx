import { component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import SpServer from "~/supabase/spServer";
// import { useContext } from "@builder.io/qwik";
// import { appContext } from "~/context/appState";
import { AttendeeCard } from "~/components/cards/attendeeCard";
// import SpBrowser from "~/supabase/spBrowser";
import { createBrowserClient } from "supabase-auth-helpers-qwik";
export const useGetGroup = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data } = await sp.get_group(id as string);
    return data;
});

export default component$(() => {
    // const app = useContext(appContext);
    const groupFetch = useGetGroup();
    const data = useStore(groupFetch.value);
    const profiles = useSignal(data.attendees.map((attendee: any) => attendee.profile));

    useVisibleTask$(() => {
        const sp = createBrowserClient(
            import.meta.env.PUBLIC_SUPABASE_URL,
            import.meta.env.PUBLIC_SUPABASE_ANON_KEY
        );
        sp.channel("group_message_channel")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "group_messages" },
                (event) => {
                    console.log(event.new);
                    data.messages.push(event.new);
                }
            )
            .subscribe();
    });

    return (
        <div>
            {profiles.value.map((profile: any) => (
                <AttendeeCard key={profile.id} profile={profile} />
            ))}
            <h1>messages</h1>
            {data.messages.map((message: any) => (
                <p key={message.id}>{message.content}</p>
            ))}
        </div>
    );
});
