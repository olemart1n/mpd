import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";

export interface UiResponse {
    message?: string | undefined;
    status?: string | undefined;
}

export const UxServerResponse = component$(({ message, status }: UiResponse) => {
    useStylesScoped$(styles);
    return <>{message && <div class={status}>{message}</div>}</>;
});
