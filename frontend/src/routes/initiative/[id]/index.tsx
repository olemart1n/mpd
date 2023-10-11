import { component$, useStylesScoped$, useVisibleTask$, $, useStore } from "@builder.io/qwik";
import { routeAction$, routeLoader$, useLocation } from "@builder.io/qwik-city";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import SpServer from "~/supabase/spServer";
import styles from "./index.css?inline";
import { UiButton } from "~/components/ui/uiButton";
import { StatusMessage } from "~/components/ui/statusMessage";
import type { ApiMessage } from "~/components/ui/statusMessage";

//-----------ROUTELOADER
export const useSpFetchSpecific = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data, error } = await sp.get_by_id("initiatives", id);
    // error && console.log(error.message);
    // data && console.log(data);
    return data;
});

//-----------ROUTEACTION
export const useShowInterest = routeAction$(async (form, reqEv) => {
    const message: ApiMessage = { message: undefined, status: undefined };
    const sp = new SpServer(reqEv);
    console.log(form);
    const { error } = await sp.show_interest("interested", [form]);
    if (error?.message) {
        message.message = error.message;
    }
    if (error?.code === "23505") {
        message.message = "Du har allerede vist interesse";
        message.status = "error";
    }
    return message;
});
//----------COMPONENT
export default component$(() => {
    useStylesScoped$(styles);
    const app = useContext(appContext);
    const action = useSpFetchSpecific();
    const showInterest = useShowInterest();
    const loc = useLocation();
    const status: ApiMessage = useStore({ message: undefined, status: undefined });
    //-------------------------------------
    useVisibleTask$(({ track }) => {
        track(() => showInterest.value);
        if (!showInterest.value) return;
        status.message = showInterest.value.message;
        status.status = showInterest.value.status;
    });
    //-------------------------------------
    const interestedFunc = $(() => {
        showInterest.submit({
            initiative_id: loc.params.id,
            profile_id: app.user?.id,
            user_gender: app.user?.user_metadata.gender,
            user_avatar: app.user?.user_metadata.user_image,
            user_name: app.user?.user_metadata.first_name,
        });
    });

    const joinButtonProps = {
        class: "hight-light",
        event: $(() => console.log("hello")),
    };
    const maybeButtonProps = {
        class: "",
        event: $(() => interestedFunc()),
    };

    return (
        <>
            {/* <h1>{action.value}</h1> */}
            {action.value &&
                action.value.map((val) => (
                    <div key={val.id} class="author-div">
                        <p>Opprettet: {val.created_at.substring(0, 10)}</p>
                        <h4>{val.author_name}</h4>
                        <h1>{val.title}</h1>
                        <p>{val.text}</p>
                        <i>vil ha med {val.allowed_attendees} personer</i>
                    </div>
                ))}
            <div class="attendees-div">Ingen er med!</div>
            <StatusMessage message={status.message} status={status.status} />
            <div class="button-group">
                <UiButton class={maybeButtonProps.class} event={maybeButtonProps.event}>
                    Har lyst
                </UiButton>
                <UiButton class={joinButtonProps.class} event={joinButtonProps.event}>
                    MedPåDet
                </UiButton>
            </div>
        </>
    );
});
