import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
export default component$(() => {
    useStylesScoped$(styles);
    return (
        <section>
            <h3>Sted: Oslo</h3>
            <input type="search" name="search-location" id="search-location" placeholder="søk" />
        </section>
    );
});
