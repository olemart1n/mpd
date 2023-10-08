import { type Signal, component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import { appContext } from "~/context/appState";
import { useContext } from "@builder.io/qwik";
export const NavIcon = component$(({ value }: Signal) => {
    const app = useContext(appContext);
    useStylesScoped$(styles);

    return (
        <button
            class={app.navIconLoading ? "loading" : value.value ? "toggled" : ""}
            onClick$={() => {
                value.value = !value.value;
            }}
        ></button>
    );
});
