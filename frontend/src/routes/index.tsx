import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import { useNavigate } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/uiCardInitiative";
import SpServer from "~/supabase/spServer";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import { UiLoader } from "~/components/ui/uiLoader";

export const useSpFetch = routeLoader$(async (reqEv) => {
    const sp = new SpServer(reqEv);
    const { error, data: initiatives } = await sp.get_initiatives_desc();
    if (error) console.log(error);
    return { initiatives };
});

export default component$(() => {
    useStylesScoped$(styles);
    const fetchSignal = useSpFetch();
    const app = useContext(appContext);
    const nav = useNavigate();

    return fetchSignal.value.initiatives ? (
        <>
            <button onClick$={() => nav("/create-initiative")} disabled={!app.user && true}>
                {!app.user ? "Du må være innlogget for å insje" : "Lag en insj"}
            </button>
            <section>
                {fetchSignal.value.initiatives.map((val: any) => (
                    <Card values={val} key={val.id} />
                ))}
            </section>
        </>
    ) : (
        <UiLoader />
    );
});

export const head: DocumentHead = {
    title: "MedPåDet",
    meta: [
        {
            name: "description",
            content: "En side hvor du kan melde deg på aktiveter sammen med andre",
        },
    ],
};
