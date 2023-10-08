import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import SpBrowser from "~/supabase/spBrowser";
import { createBrowserClient } from "supabase-auth-helpers-qwik";

export const ButtonSignOut = component$(() => {
    const btn = useSignal<HTMLButtonElement>();
    useVisibleTask$(() => {
        const signOut = async () => {
            const sp = createBrowserClient("345", "3453453");
            // const { error } = await sp.auth.signOut();
            // error && console.log(error);
            // localStorage.clear();
            // document.location.replace("/");
        };
        btn.value?.addEventListener("click", () => {
            signOut();
        });
    });
    return <button ref={btn}>Logg ut</button>;
});
