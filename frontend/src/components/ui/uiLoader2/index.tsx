import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
export const UiLoader2 = component$(() => {
    useStylesScoped$(styles);
    return <span class="loader"></span>;
});
