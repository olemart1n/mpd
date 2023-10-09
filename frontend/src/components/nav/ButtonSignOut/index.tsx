import { type Signal, component$ } from "@builder.io/qwik";
import { server$, useNavigate } from "@builder.io/qwik-city";
import SpServer from "~/supabase/spServer";
import type { RequestEvent } from "@builder.io/qwik-city";

const signOut = server$(async function () {
    const sp = new SpServer(this as RequestEvent);
    const error = await sp.log_out();

    console.log(error);
    return error;
});

export const ButtonSignOut = component$(({ value }: Signal) => {
    const nav = useNavigate();
    return (
        <button
            onClick$={() => {
                signOut();
                localStorage.clear();
                nav("/");
                value.value = !value.value;
            }}
        >
            Logg ut
        </button>
    );
});
