import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import { useNavigate } from "@builder.io/qwik-city";
export default component$(() => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    return (
        <>
            <button onClick$={() => nav("/create-initiative")}>Lag en insj</button>
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
