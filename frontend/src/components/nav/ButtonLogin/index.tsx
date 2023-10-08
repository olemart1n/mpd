import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import { useNavigate } from "@builder.io/qwik-city";
export const ButtonLogin = component$(() => {
    const nav = useNavigate();
    useStylesScoped$(styles);
    return <button onClick$={() => nav("/auth/sign-in")}>Logg inn</button>;
});
