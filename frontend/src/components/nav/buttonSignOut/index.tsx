import { type Signal, component$, useStylesScoped$ } from "@builder.io/qwik";
import { server$, useNavigate } from "@builder.io/qwik-city";
import type { RequestEvent } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import { LuLogOut } from "@qwikest/icons/lucide";
const signOut = server$(async function () {
    const sp = (this as RequestEvent).sharedMap.get("serverClient");
    const error = await sp.log_out();
    return error;
});

export const ButtonSignOut = component$(({ value }: Signal) => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    return (
        <button
            onClick$={() => {
                signOut();
                localStorage.clear();
                nav("/");
                value.value = !value.value;
                setTimeout(() => {
                    document.location.reload();
                }, 500);
            }}
        >
            <LuLogOut /> Logg ut
        </button>
    );
});
