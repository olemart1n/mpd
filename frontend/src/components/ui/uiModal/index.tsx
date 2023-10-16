import { Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import styles from "./index.css?inline";
export const UiModal = component$(() => {
    useStylesScoped$(styles);
    const app = useContext(appContext);
    return (
        <dialog open={app.dialogOpen && true}>
            <div class="div-avbryt">
                <button onClick$={() => (app.dialogOpen = false)}>Avbryt</button>
            </div>
            <div class="slot-wrapper">
                <Slot />
            </div>
        </dialog>
    );
});
