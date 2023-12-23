import {
    component$,
    useStylesScoped$,
    $,
    useStore,
    useTask$,
    useVisibleTask$,
} from "@builder.io/qwik";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context";
import styles from "./index.css?inline";
import { UserCardLight, UserCard, UiButton, UxServerResponse, type UiResponse } from "~/components";
import { type PostgrestError } from "@supabase/supabase-js";
import { LuUser2 } from "@qwikest/icons/lucide";

//-----------ROUTELOADER
export const useSpFetchInitiative = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = reqEv.sharedMap.get("serverClient");
    const { data } = await sp.get_initiative(id);
    return data;
});

// CANCEL INTEREST
export const useCancelInterest = routeAction$(async (form, reqEv) => {
    const { id } = reqEv.params;
    const { profile_id } = form;
    const sp = reqEv.sharedMap.get("serverClient");
    const { data } = await sp
        .from("interested")
        .delete()
        .eq("profile_id", profile_id)
        .eq("initiative_id", id);
    return data;
});

// SET INTEREST
export const useSetInterest = routeAction$(async (form, reqEv) => {
    const { id } = reqEv.params;
    const sp = reqEv.sharedMap.get("serverClient");
    const { error } = await sp
        .from("interested")
        .insert({ ...form, initiative_id: id })
        .select();
    const { message, status } = interestedClickErrorHandling(error);
    return { message, status };
});

export const useSetImDown = routeAction$(async (form, reqEv) => {
    const { id } = reqEv.params;
    const sp = reqEv.sharedMap.get("serverClient");
    const { error } = await sp.set_imDown({ ...form, initiative_id: id });
    const { message, status } = imDownClickErrorHandling(error);
    return { message, status };
});

//------------------------------------------COMPONENT---------------------------------------------------
export default component$(() => {
    useStylesScoped$(styles);
    const app = useContext(appContext);
    const RL1 = useSpFetchInitiative();
    const data = useStore(RL1.value);
    const uxResponse: UiResponse = useStore({ message: undefined, status: undefined });
    const options = useStore({
        setInterest: useSetInterest(),
        cancelInterest: useCancelInterest(),
        setImDown: useSetImDown(),
        hasClickedMaybe: false,
    });
    useTask$(({ track }) => {
        track(() => {
            options.setInterest.status;
            options.cancelInterest.status;
            options.setImDown.status;
        });
        if (options.setInterest.status) {
            uxResponse.message = options.setInterest.value?.message;
            uxResponse.status = options.setInterest.value?.status;
            uxResponse.status === "success" &&
                data.interested.push({
                    username: app.profile?.username,
                    age: app.profile?.age,
                    profile_id: app.profile?.id,
                }) &&
                (options.hasClickedMaybe = true);
        }
        if (options.cancelInterest.status) {
            const newArr = data.interested.filter(
                ({ profile_id }: any) => profile_id !== app.profile?.id
            );
            data.interested = newArr;
            options.hasClickedMaybe = false;
        }
        if (options.setImDown.status) {
            uxResponse.message = options.setImDown.value?.message;
            uxResponse.status = options.setImDown.value?.status;
            uxResponse.status === "success" && (app.navIconLoading = true);
            app.isNewProfileData = true;
        }
    });
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const interestId = data.interested.find(
            ({ profile_id }: any) => profile_id === app.profile?.id
        );
        interestId && (options.hasClickedMaybe = true);
    });

    const cancelInterest = $(() => {
        options.cancelInterest.submit({ profile_id: app.profile?.id });
    });
    const setInterest = $(() => {
        options.setInterest.submit({
            profile_id: app.profile?.id,
            gender: app.profile?.gender,
            username: app.profile?.username,
            age: app.profile?.age,
        });
    });
    const setImDown = $(() => {
        options.setImDown.submit({
            profile_id: app.profile?.id,
            gender: app.profile?.gender,
            username: app.profile?.username,
            age: app.profile?.age,
            //avatar is inserted in the database
        });
    });
    return (
        <>
            <section class="box">
                <div class="initiative-info">
                    <h1>{data.title}</h1>
                    <p>{data.text}</p>
                    <i>vil ha med {data.allowed_attendees} personer</i>
                </div>
                <div class="author-div">
                    {data.author_id.avatar ? (
                        <img
                            src={data.author_id.avatar}
                            width={100}
                            height={100}
                            alt="image of initiative author"
                        />
                    ) : (
                        <LuUser2 />
                    )}

                    <h2>{data.author_id.username}</h2>
                    <p>{data.author_id.age}</p>
                </div>
                <div class="attended-users">
                    {data.imDown.map((user: any) => (
                        <UserCard props={user} key={user.id} />
                    ))}
                </div>
            </section>
            <UxServerResponse message={uxResponse.message} status={uxResponse.status} />
            <div class="box button-group">
                <div>
                    {options.hasClickedMaybe ? (
                        <UiButton class={""} click$={() => cancelInterest()}>
                            Angre
                        </UiButton>
                    ) : (
                        <UiButton class={""} click$={$(() => setInterest())}>
                            Kanskje
                        </UiButton>
                    )}
                </div>
                <div>
                    <UiButton class={"hight-light"} click$={$(() => setImDown())}>
                        MedPåDet
                    </UiButton>
                </div>
            </div>

            <div class="interested-count-div">{data.interested_count + " har trykket kanskje"}</div>
            <div class="interested">
                {data.interested.map((user: any) => (
                    <UserCardLight key={user.id} props={user} />
                ))}
            </div>
        </>
    );
});

const imDownClickErrorHandling = (
    error: PostgrestError | null
): { message: string; status: string } => {
    const apiResponse = { message: "", status: "" };
    if (!error) {
        apiResponse.message = "Du er med!";
        apiResponse.status = "success";
    } else if (error.code === "23505") {
        apiResponse.message = "Du kan ikke bli mer enn en gang";
        apiResponse.status = "error";
    } else if (error.code === "42501") {
        apiResponse.message = "Du må logge inn.";
        apiResponse.status = "error";
    } else {
        apiResponse.message = error.message;
        apiResponse.status = "error";
    }
    return apiResponse;
};
const interestedClickErrorHandling = (
    error: PostgrestError | null
): { message: string; status: string } => {
    const apiResponse = { message: "", status: "" };
    if (!error) {
        apiResponse.message = "Kanskje!";
        apiResponse.status = "success";
    } else if (error.code === "23505") {
        apiResponse.message = "Du har allerede vist interesse";
        apiResponse.status = "error";
    } else if (error.code === "42501") {
        apiResponse.message = "Du må logge inn.";
        apiResponse.status = "error";
    } else {
        apiResponse.message = error.message;
        apiResponse.status = "error";
    }
    return apiResponse;
};
