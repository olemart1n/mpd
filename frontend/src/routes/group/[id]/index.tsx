import {
    component$,
    useSignal,
    useStylesScoped$,
    // useVisibleTask$,
    useStore,
    useTask$,
} from "@builder.io/qwik";
import { type DocumentHead, Form, routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import SpServer from "~/supabase/spServer";
import { LuUserCircle, LuSend } from "@qwikest/icons/lucide";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
// import { AttendeeCard } from "~/components/cards/attendeeCard";
import styles from "./index.css?inline";

// import { createBrowserClient } from "supabase-auth-helpers-qwik";
export const useGetGroup = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data } = await sp.get_group(id as string);
    // console.log(data.messages[0]?.author_id);
    return data;
});

export const useSendChatMessage = routeAction$(async (form, reqEv) => {
    const { id } = reqEv.params;

    const message = { group_id: id, ...form };
    console.log(message);
    const sp = new SpServer(reqEv);
    const { data } = await sp.post("group_messages", message);
    console.log(data);
});

export default component$(() => {
    const app = useContext(appContext);
    useStylesScoped$(styles);
    const data = useGetGroup();
    const profiles = useSignal<[]>(data.value.attendees?.map((attendee: any) => attendee.profile));
    const avatarUrl = "https://oilmvgzqferfdqjvtsxz.supabase.co/storage/v1/object/public/avatars/";
    const messages = useStore(data.value.messages);
    const routeAction = useSendChatMessage();
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
    useTask$(({ track }) => {
        track(() => messages);
        messages.map((message: any) => {
            const profile = data.value.attendees.find(
                (attendee: any) => attendee.profile_id === message.author_id
            );

            profile !== undefined
                ? (message.avatar = avatarUrl + profile.profile_id)
                : (message.avatar = null);
        });
    });
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
            <div class="chat-container">
                <div class="messages">
                    {" "}
                    {messages.map((message: any) => (
                        <div key={message.id} class="message">
                            <div style={{ width: "5rem" }}>
                                {" "}
                                {message.avatar && message.avatar !== null ? (
                                    <img
                                        src={message.avatar}
                                        width={50}
                                        height={50}
                                        class="message-avatar"
                                        alt="avatar"
                                    />
                                ) : (
                                    <LuUserCircle class="chat-avatar-icon" />
                                )}
                            </div>
                            <div class="message-line">
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Form
                    style={{ display: "flex", width: "100%", placeContent: "center" }}
                    preventdefault:submit
                    action={routeAction}
                    spaReset
                >
                    <button>
                        <LuSend />
                    </button>
                    <input
                        type="text"
                        hidden
                        name="author_id"
                        id="author_id"
                        value={app.profile?.id}
                    />
                    <input type="text" name="content" id="content" />
                </Form>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "MedPåDet",
    meta: [
        {
            name: "description",
            content: "Chat med gruppedeltakere ",
        },
        {
            name: "viewport",
            content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
    ],
};
