import {
    component$,
    useSignal,
    useStylesScoped$,
    useVisibleTask$,
    useStore,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import SpServer from "~/supabase/spServer";
import { LuUserCircle } from "@qwikest/icons/lucide";
// import { useContext } from "@builder.io/qwik";
// import { appContext } from "~/context/appState";
// import { AttendeeCard } from "~/components/cards/attendeeCard";
import styles from "./index.css?inline";

import { createBrowserClient } from "supabase-auth-helpers-qwik";
export const useGetGroup = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data } = await sp.get_group(id as string);
    return data;
});

export default component$(() => {
    // const app = useContext(appContext);
    useStylesScoped$(styles);
    const data = useGetGroup();
    const profiles = useSignal<[]>(data.value.attendees.map((attendee: any) => attendee.profile));
    const messages = useStore(data.value.messages);
    // useVisibleTask$(() => {
    //     const sp = createBrowserClient(
    //         import.meta.env.PUBLIC_SUPABASE_URL,
    //         import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    //     );
    //     sp.channel("group_message_channel")
    //         .on(
    //             "postgres_changes",
    //             { event: "*", schema: "public", table: "group_messages" },
    //             (event) => {
    //                 console.log(event.new);
    //                 messages.push(event.new);
    //                 console.log(messages.value);
    //             }
    //         )
    //         .subscribe();
    // });
    return (
        <div>
            <section>
                <div class="initiative-meta">
                    <div class="user-meta">
                        {data.value.initiative.avatar ? (
                            <img src={data.value.initiative.avatar} height={50} width={50} />
                        ) : (
                            <LuUserCircle class="img-icon" />
                        )}
                        <h2>
                            {data.value.initiative.author_username},{" "}
                            {data.value.initiative.profiles.age}
                        </h2>
                    </div>
                    <div>
                        <h1>{data.value.initiative.title}</h1>
                        <p>
                            {data.value.initiative.date.substring(5, 10)} Kl{" "}
                            {data.value.initiative.time.substring(0, 5)}
                        </p>
                        <p>
                            {data.value.initiative.attendees_count} /{" "}
                            {data.value.initiative.allowed_attendees} har meldt seg på
                        </p>
                        <div style={{ margin: "1rem auto" }}>{data.value.initiative.text}</div>
                    </div>
                </div>
                <div class="attendees">
                    {profiles.value.map((attendee: any) =>
                        attendee.avatar ? (
                            <img
                                src={attendee.avatar}
                                height={50}
                                width={50}
                                key={attendee.id}
                            ></img>
                        ) : (
                            <LuUserCircle key={attendee.id} style={{ fontSize: "50px" }} />
                        )
                    )}
                </div>
            </section>
            {messages.map((message: any) => (
                <p key={message.id}>{message.content}</p>
            ))}
        </div>
    );
});
