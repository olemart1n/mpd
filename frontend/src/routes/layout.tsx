import {
    component$,
    Slot,
    useContextProvider,
    useStore,
    useVisibleTask$,
    useContext,
} from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
import { Nav } from "~/components/nav";
import { Footer } from "~/components/footer";
import { appContext, type App } from "~/context/appState";

export default component$(() => {
    const appState: App = useStore({ navIconLoading: false, user: null });
    useContextProvider(appContext, appState);
    const app = useContext(appContext);
    useVisibleTask$(() => {
        if (localStorage.getItem("user") && !app.user) {
            app.user = JSON.parse(localStorage.getItem("user") as string);
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
