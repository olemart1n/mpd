import {
    component$,
    useStylesScoped$,
    useVisibleTask$,
    $,
    useStore,
    useSignal,
    useTask$,
} from "@builder.io/qwik";
import {
    type RequestEvent,
    routeAction$,
    routeLoader$,
    server$,
    useLocation,
} from "@builder.io/qwik-city";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import SpServer from "~/supabase/spServer";
import styles from "./index.css?inline";
import { UiButton } from "~/components/ui/uiButton";
import { StatusMessage } from "~/components/ui/statusMessage";
import { UiCardUSer } from "~/components/ui/uiCardUser";
import type { ApiMessage } from "~/components/ui/statusMessage";
import { UiLoader } from "~/components/ui/uiLoader";

//-----------ROUTELOADER
export const useSpFetchInitiative = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data: i, error: errInitiative } = await sp.get_by_id("initiatives", id);
    errInitiative && console.log(errInitiative);

    const { data: interested, error: errInterest } = await sp.get_all_interested(id);
    errInterest && console.log(errInterest);
    const initiative = i && i[0]; // initiative is is the first item in an array and is sent as only an object instead of array
    return { initiative, interested };
});

//-----------ROUTEACTION
export const useClickInterested = routeAction$(async (form, reqEv) => {
    const message: ApiMessage = { message: undefined, status: undefined };
    const sp = new SpServer(reqEv);
    const { error } = await sp.add_interest("interested", [form]);
    if (!error) {
        message.message = "Du har lyst";
        message.status = "success";
    }
    if (error?.message) {
        message.message = error.message;
    }
    if (error?.code === "23505") {
        message.message = "Du har allerede vist interesse";
        message.status = "error";
    }
    return message;
});

//------------------------------------------SERVER---------------------------------------------

// const channel = server$(function () {
//     const sp = new SpServer(this as RequestEvent);
//     return sp.channel_interested;
// });

//------------------------------------------COMPONENT---------------------------------------------------
export default component$(() => {
    //--------------------------------
    useStylesScoped$(styles);
    const loc = useLocation();
    //--------------------------------
    const app = useContext(appContext); // APP CONTEXT
    //--------------------------------
    const signal = useSpFetchInitiative(); // DATA FROM ROUTELOADER
    //--------------------------------
    const clickInterested = useClickInterested(); // ROUTE ACTION
    //--------------------------------
    const status: ApiMessage = useStore({ message: undefined, status: undefined }); //ERROR MESSAGE TO USER
    //--------------------------------
    useTask$(({ track }) => {
        // MÅ MULIGENS GJØRE OM TIL USEVISIBLETASK
        track(() => clickInterested.value);
        if (!clickInterested.value) return;
        status.message = clickInterested.value.message;
        status.status = clickInterested.value.status;
    });
    //--------------------------------
    //-------------------------------------
    const interestedFunc = $(() => {
        clickInterested.submit({
            initiative_id: loc.params.id,
            profile_id: app.user?.id,
            user_gender: app.user?.user_metadata.gender,
            user_avatar: app.user?.user_metadata.user_image,
            first_name: app.user?.user_metadata.first_name,
        });
    });
    //--------------------------------------
    const joinButtonProps = {
        class: "hight-light",
        event: $(() => console.log("hello")),
    };
    const maybeButtonProps = {
        class: "",
        event: $(() => interestedFunc()),
    };

    //----------------------------------JSX
    return signal.value.initiative && signal.value.interested ? (
        <>
            {/* <p>Opprettet: {signal.value.initiative.created_at.toString().substring(0, 10)}</p> */}

            <div key={signal.value.initiative.id} class="author-div">
                <div class="user-card">
                    {" "}
                    <UiCardUSer
                        age={signal.value.initiative.age}
                        first_name={signal.value.initiative.author_name}
                        avatar="https://c8.alamy.com/comp/G2M93N/profile-view-of-displeased-man-G2M93N.jpg"
                        gender={signal.value.initiative.gender}
                    />
                </div>
                <p>{signal.value.initiative.title}</p>
                <h4>{signal.value.initiative.author_name}</h4>
                <h1>{signal.value.initiative.title}</h1>
                <p>{signal.value.initiative.text}</p>
                <i>vil ha med {signal.value.initiative.allowed_attendees} personer</i>
            </div>

            <StatusMessage message={status.message} status={status.status} />
            <div class="button-group">
                <UiButton class={maybeButtonProps.class} event={maybeButtonProps.event}>
                    Har lyst
                </UiButton>
                <UiButton class={joinButtonProps.class} event={joinButtonProps.event}>
                    MedPåDet
                </UiButton>
            </div>
            <div class="attendees-div">
                {signal.value.initiative.interested_count + " har lyst"}
            </div>
            <div class="interested">
                {signal.value.interested.map((val) => (
                    <div key={val.id}>
                        <UiCardUSer
                            age={val.age}
                            first_name={val.first_name}
                            avatar="https://c8.alamy.com/comp/G2M93N/profile-view-of-displeased-man-G2M93N.jpg"
                            gender={val.gender}
                        />
                    </div>
                ))}
            </div>
        </>
    ) : (
        <UiLoader />
    );
});
