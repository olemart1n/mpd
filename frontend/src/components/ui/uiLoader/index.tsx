import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
export const UiLoader = component$(() => {
    useStylesScoped$(styles);
    return <span></span>;
});
