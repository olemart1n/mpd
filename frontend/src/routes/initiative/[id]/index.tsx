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
import { appContext } from "~/context/appState";
import SpServer from "~/supabase/spServer";
import styles from "./index.css?inline";
import { UserCardLight, UserCard, UiButton, UxServerResponse, type UiResponse } from "~/components";
import {
    interestedClickErrorHandling,
    imDownClickErrorHandling,
} from "~/utils/apiResponseHandling";

//-----------ROUTELOADER
export const useSpFetchInitiative = routeLoader$(async (reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { data } = await sp.get_initiative(id);
    // console.log(data);
    return data;
});
// CANCEL INTEREST
export const useCancelInterest = routeAction$(async (form, reqEv) => {
    const { id } = reqEv.params;
    const { profile_id } = form;
    const sp = new SpServer(reqEv);
    const { data } = await sp.cancel_interest(profile_id as string, id as string);
    return data;
});
// SET INTEREST
export const useSetInterest = routeAction$(async (form, reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
    const { error } = await sp.set_interest({ ...form, initiative_id: id });
    const { message, status } = interestedClickErrorHandling(error);
    return { message, status };
});

export const useSetImDown = routeAction$(async (form, reqEv) => {
    const { id } = reqEv.params;
    const sp = new SpServer(reqEv);
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
                    username: app.user?.user_metadata.username,
                    age: app.user?.user_metadata.age,
                    profile_id: app.user?.id,
                }) &&
                (options.hasClickedMaybe = true);
        }
        if (options.cancelInterest.status) {
            const newArr = data.interested.filter(
                ({ profile_id }: any) => profile_id !== app.user?.id
            );
            data.interested = newArr;
            options.hasClickedMaybe = false;
        }
        if (options.setImDown.status) {
            uxResponse.message = options.setImDown.value?.message;
            uxResponse.status = options.setImDown.value?.status;
            uxResponse.status === "success" && (app.navIconLoading = true);
        }
    });
    useVisibleTask$(() => {
        const interestId = data.interested.find(
            ({ profile_id }: any) => profile_id === app.user?.id
        );
        interestId && (options.hasClickedMaybe = true);
    });

    const cancelInterest = $(() => {
        options.cancelInterest.submit({ profile_id: app.user?.id });
    });
    const setInterest = $(() => {
        options.setInterest.submit({
            profile_id: app.user?.id,
            gender: app.user?.user_metadata.gender,
            username: app.user?.user_metadata.username,
            age: app.user?.user_metadata.age,
        });
    });
    const setImDown = $(() => {
        options.setImDown.submit({
            profile_id: app.user?.id,
            gender: app.user?.user_metadata.gender,
            username: app.user?.user_metadata.username,
            age: app.user?.user_metadata.age,
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
                    <img
                        src={data.author_id.avatar}
                        width={100}
                        height={100}
                        alt="image of initiative author"
                    />
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
