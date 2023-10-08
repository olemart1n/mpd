import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";

export interface ApiMessage {
    message?: string | undefined;
    status?: string | undefined;
}

export const StatusMessage = component$(({ message, status }: ApiMessage) => {
    useStylesScoped$(styles);
    return <>{message && <div class={status}>{message}</div>}</>;
});
