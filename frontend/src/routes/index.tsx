import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import { useNavigate } from "@builder.io/qwik-city";
import { Card } from "~/components/card";
import SpServer from "~/supabase/spServer";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
export const useSpFetch = routeLoader$(async (reqEv) => {
    const sp = new SpServer(reqEv);
    const { error, data } = await sp.get_initiatives_desc("initiatives");
    if (error) console.log(error);
    return data;
});

export default component$(() => {
    useStylesScoped$(styles);
    const action = useSpFetch();
    const app = useContext(appContext);
    const nav = useNavigate();
    return (
        <>
            <button onClick$={() => nav("/create-initiative")} disabled={!app.user && true}>
                {!app.user ? "Du må være innlogget for å insje" : "Lag en insj"}
            </button>
            <section>
                {action.value?.map((init: any) => <Card values={init} key={init.id} />)}
            </section>
        </>
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
