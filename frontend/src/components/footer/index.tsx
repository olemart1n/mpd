import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
export const Footer = component$(() => {
    useStyles$(styles);
    return (
        <footer>
            <p>Lagd med ♡ av oss i MedPåDet</p>
        </footer>
    );
});
