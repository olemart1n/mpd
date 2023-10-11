import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
// import { type PropFunction, component$, Slot } from "@builder.io/qwik";

interface uiBtn {
    // event?: { onClick$?: PropFunction<() => void> };
    event: () => void;
    class: string | null;
}

export const UiButton = component$<uiBtn>((props: uiBtn) => {
    useStylesScoped$(styles);
    return (
        <button onClick$={props.event} class={props.class}>
            <Slot />
        </button>
    );
});
// export const UiButton = component$<{
//     onClick$?: PropFunction<() => void>;
// }>((props) => {
//     return (
//         <button onClick$={props.onClick$}>
//             <Slot />
//         </button>
//     );
// });
