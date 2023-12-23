import {
    component$,
    Slot,
    useContextProvider,
    useStore,
    useVisibleTask$,
    useContext,
} from "@builder.io/qwik";
import { routeAction$, type RequestHandler } from "@builder.io/qwik-city";
import { Nav } from "~/components/nav";
import { Footer } from "~/components";
import { appContext, type App } from "~/context";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const onRequest: RequestHandler = async (reqEv) => {
    reqEv.sharedMap.set(
        "serverClient",
        createServerClient(
            import.meta.env.PUBLIC_SUPABASE_URL,
            import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
            reqEv
        )
    );
};

export const useDatabase = routeAction$(async (form, reqEv) => {
    const { id } = form;
    const spServer = reqEv.sharedMap.get("serverClient");
    const { data } = await spServer
        .from("profiles")
        .select("*, imdown(initiatives(title, groups(id)))")
        .eq("id", id)
        .single();
    const { imdown, ...rest } = data;
    const attended_groups = imdown.map((x: any) => {
        return { title: x?.initiatives?.title, id: x?.initiatives?.groups?.id };
    });
    const profileState = { ...rest, attended_groups };
    return { profile: profileState };
});

export default component$(() => {
    const appState: App = useStore({
        navIconLoading: false,
        profile: null,
        dialogOpen: false,
        isNewProfileData: false,
    });
    useContextProvider(appContext, appState);
    const app = useContext(appContext);
    const action = useDatabase();
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => {
            app.isNewProfileData;
            action.value;
        });
        if (app.isNewProfileData) {
            action.submit({ id: app.profile?.id });
            app.isNewProfileData = false;
        }
        if (action.value) {
            app.profile = action.value.profile;
            localStorage.setItem("profile", JSON.stringify(action.value.profile));
        }
        if (localStorage.getItem("profile") && !app.profile) {
            app.profile = JSON.parse(localStorage.getItem("profile") as string);
        }
    });
    return (
        <>
            <header>
                <Nav />
            </header>
            <main>
                <Slot />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
});

// export const onGet: RequestHandler = async ({ cacheControl }) => {
//     cacheControl({
//         staleWhileRevalidate: 60 * 60 * 24 * 7,
//         maxAge: 5,
//     });
// };

export const onGet: RequestHandler = async ({ cacheControl }) => {
    cacheControl({
        maxAge: 0,
        sMaxAge: 0,
        staleWhileRevalidate: 0,
    });
};
