import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import { LuUserSquare } from "@qwikest/icons/lucide";
import { routeLoader$ } from "@builder.io/qwik-city";
import SpServer from "~/supabase/spServer";
export const useSpFetchProfile = routeLoader$(async (reqEv) => {
    const sp = new SpServer(reqEv);
    try {
        const { data: sessionData } = await sp.get_session();
        const { user } = await sp.get_logged_in_user_profile(
            "profiles",
            sessionData.session?.user.id as string
        );
        if (user) return { OK: true, user: user[0] };
    } catch (error) {
        return { OK: false, user: null };
    }
});

export default component$(() => {
    const fetch = useSpFetchProfile();
    useContext(appContext);
    useStylesScoped$(styles);
    return (
        <div>
            {" "}
            {fetch.value?.OK ? (
                <section>
                    <LuUserSquare class="profile-icon" />
                    <div class="info-div">
                        <h1>{fetch.value.user.username}</h1>

                        <p>{fetch.value.user.email}</p>
                    </div>
                </section>
            ) : (
                <p>Kunne ikke laste inn bruker</p>
            )}
        </div>
    );
});
