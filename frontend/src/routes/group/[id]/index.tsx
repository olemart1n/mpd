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
import { UiLoader, UiButton } from "~/components";
import { type DocumentHead, routeLoader$, server$ } from "@builder.io/qwik-city";
import { LuUserCircle, LuSend, LuArrowLeftCircle } from "@qwikest/icons/lucide";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context";
import styles from "./index.css?inline";
import { createBrowserClient } from "supabase-auth-helpers-qwik";
export interface MessageSubscription {
    author_id: string;
    content: string;
    created_at: string;
    group_id: string | number;
    id: string | number;
    avatar?: string | null;
}
export const useGetGroup = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = reqEv.sharedMap.get("serverClient");
    const { data } = await sp
        .from("profiles")
        .select("*, imdown(initiatives(title, groups(id)))")
        .eq("id", id)
        .single();
    return data;
});
export const useGetGroupMessages = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = reqEv.sharedMap.get("serverClient");
    const { data } = await sp.from("group_messages").select("*").eq("group_id", id);
    return data;
});

const sendMessage = server$(async function (form) {
    const { id } = this.params;
    const message = { group_id: id, ...form };
    const sp = (this as RequestEvent).sharedMap.get("serverClient");
    await sp.from("group_messages").insert(message);
});

export default component$(() => {
    const app = useContext(appContext);
    useStylesScoped$(styles);
    const data = useGetGroup();
    const messagesFetch = useGetGroupMessages();
    const messagesStore = useStore({ value: messagesFetch.value, attendees: data.value.attendees });
    const avatarUrl = "https://oilmvgzqferfdqjvtsxz.supabase.co/storage/v1/object/public/avatars/";
    const chatInput = useSignal("");
    const chatEnd = useSignal<HTMLDivElement>();
    const isInfoClicked = useSignal(false);
    // eslint-disable-next-line qwik/no-use-visible-task
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
                        messagesStore.value.push(newMessage);
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
        messagesStore.value.map((message: any) => {
            const profile = data.value.attendees.find(
                (attendee: any) => attendee.profile_id === message.author_id
            );

            profile !== undefined
                ? (message.avatar = avatarUrl + profile.profile_id)
                : (message.avatar = null);
        });
    });
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => messagesStore.value.length);
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
    return data.value.messages ? (
        <div class="page-wrapper">
            <section class={isInfoClicked.value && "sm-screen-toggle"}>
                <div class="initiative-meta">
                    <div class="user-meta"></div>
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
                <div>
                    <h3>Deltakere</h3>
                    <div class="attendees">
                        {" "}
                        {data.value.attendees?.map((attendee: any, i: number) =>
                            attendee ? (
                                <div key={i} class="attendee">
                                    <img
                                        src={attendee.profile.avatar}
                                        height={50}
                                        width={50}
                                        key={attendee.id}
                                    ></img>
                                    <p>{attendee.profile.username}</p>
                                </div>
                            ) : (
                                <div key={i}>
                                    <LuUserCircle key={attendee.id} style={{ fontSize: "50px" }} />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
            <div class="chat-container">
                <div class="small-device-container">
                    <p>{data.value.initiative.title}</p>

                    <UiButton
                        click$={() => {
                            if (isInfoClicked.value) {
                                isInfoClicked.value = false;
                            } else isInfoClicked.value = true;
                            console.log(isInfoClicked.value);
                        }}
                        class={""}
                    >
                        <LuArrowLeftCircle />
                    </UiButton>
                </div>
                <div class="messages">
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
                <form>
                    <input
                        type="text"
                        bind:value={chatInput}
                        onKeyDown$={(e) => e.key === "Enter" && (e.preventDefault(), send())}
                    />
                    <button type="button" onClick$={send}>
                        <LuSend class="send-icon" />
                    </button>
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
