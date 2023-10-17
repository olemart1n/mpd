import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import { type PropFunction } from "@builder.io/qwik";

interface uiBtn {
    // event?: { onClick$?: PropFunction<() => void> };
    click$: PropFunction<() => void>;
    class: string | null;
}

export const UiButton = component$<uiBtn>((props: uiBtn) => {
    useStylesScoped$(styles);
    return (
        <button onClick$={props.click$} class={props.class}>
            <Slot />
        </button>
    );
});
