import {
    component$,
    useStylesScoped$,
    // useVisibleTask$,
    useStore,
    useTask$,
    $,
    useSignal,
    useVisibleTask$,
} from "@builder.io/qwik";
import type { RequestEvent } from "@builder.io/qwik-city";
import { UiLoader } from "~/components";
import { type DocumentHead, routeLoader$, server$ } from "@builder.io/qwik-city";
import SpServer from "~/supabase/spServer";
import { LuUserCircle, LuSend } from "@qwikest/icons/lucide";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import styles from "./index.css?inline";
import type { MessageSubscription } from "~/utils";

import { createBrowserClient } from "supabase-auth-helpers-qwik";
export const useGetGroup = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data } = await sp.get_group(id as string);
    return data;
});
export const useGetGroupMessages = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data } = await sp.get_group_messages(id as string);
    return data;
});

const sendMessage = server$(async function (form) {
    const { id } = this.params;
    const message = { group_id: id, ...form };
    const sp = new SpServer(this as RequestEvent);
    await sp.post("group_messages", message);
});
export default component$(() => {
    const app = useContext(appContext);
    useStylesScoped$(styles);
    const data = useGetGroup();
    const messagesFetch = useGetGroupMessages();
    const messagesStore = useStore({ value: messagesFetch.value, attendees: data.value.attendees });
    const avatarUrl = "https://oilmvgzqferfdqjvtsxz.supabase.co/storage/v1/object/public/avatars/";
    const chatInput = useSignal("");
    const chatMessagesDiv = useSignal<HTMLDivElement>();
    const chatEnd = useSignal<HTMLDivElement>();
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
                    const newMessage = event.new as MessageSubscription;
                    const profile =
                        messagesStore.attendees &&
                        messagesStore.attendees.find(
                            (profile: any) => profile.profile_id === newMessage.author_id
                        );
                    if (profile) {
                        newMessage.avatar = profile.profile.avatar;
                    } else {
                        newMessage.avatar = null;
                    }

                    if (Number(newMessage.group_id) === Number(data.value.id)) {
                        messagesStore.value && messagesStore.value.push(newMessage);
                    }
                }
            )
            .subscribe();
    });

    useTask$(({ track }) => {
        track(() => messagesFetch.value);
        messagesStore.value = messagesFetch.value;
    });

    useTask$(({ track }) => {
        track(() => messagesFetch.value);
        if (!messagesStore.value) return;
        messagesStore.value.map((message: any) => {
            const profile = data.value.attendees.find(
                (attendee: any) => attendee.profile_id === message.author_id
            );

            profile !== undefined
                ? (message.avatar = avatarUrl + profile.profile_id)
                : (message.avatar = null);
        });
    });
    useVisibleTask$(({ track }) => {
        track(() => messagesStore.value?.length);
        chatEnd.value?.scrollIntoView({ behavior: "smooth" });
    });

    const send = $(async () => {
        const messageState = {
            content: chatInput.value,
            author_id: app.profile?.id,
        };
        chatInput.value = "";
        await sendMessage(messageState);
    });
    return data.value.messages && messagesStore.value ? (
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
                    {data.value.attendees?.map((attendee: any) =>
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
                <div class="messages" ref={chatMessagesDiv}>
                    {" "}
                    {messagesStore.value.map((message: any, i: any) => (
                        <div key={i} class="message">
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
                                <div class="created_at">{message.created_at.substring(11, 16)}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEnd}></div>
                </div>
                <form style={{ display: "flex", width: "100%", placeContent: "center" }}>
                    <button type="button" onClick$={send}>
                        <LuSend />
                    </button>
                    <input type="text" name="content" id="content" bind:value={chatInput} />
                </form>
            </div>
        </div>
    ) : (
        <UiLoader />
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
