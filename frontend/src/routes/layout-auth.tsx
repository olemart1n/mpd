import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import styles from "./auth-styles.css?inline";

export default component$(() => {
    useStyles$(styles);
    return (
        <>
            <header>
                <Link
                    href="/"
                    style={{
                        textDecoration: "none",
                        color: "var(--mdp-text-dark)",
                        textAlign: "center",
                    }}
                >
                    <h1>medPåDet</h1>
                </Link>
            </header>
            <main>
                <Slot />
            </main>
            <footer>er du med?</footer>
        </>
    );
});
