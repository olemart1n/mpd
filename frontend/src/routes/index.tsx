import { component$ } from "@builder.io/qwik";
import { routeAction$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { PostInitiative } from "~/components/forms/postInitiative";
export const useSpPostFile = routeAction$(() => {});

export default component$(() => {
    const action = useSpPostFile();
    return (
        <>
            <h1>Hi 👋</h1>
            <p>
                Can't wait to see what you build with qwik!
                <br />
                Happy coding.
            </p>
            {/* <Form preventdefault:submit action={action}>
                <PostInitiative />
            </Form> */}
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
