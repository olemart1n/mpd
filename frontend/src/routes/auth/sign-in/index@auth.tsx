import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import styles from "../index.css?inline";
export default component$(() => {
    useStylesScoped$(styles);
    return (
        <Form style={{ display: "flex", flexDirection: "column" }}>
            <h2>Logg inn</h2>
            <label for="email">Mail addresse</label>
            <input type="email" name="email" id="email" />
            <label for="password">Passord</label>
            <input type="password" name="password" id="password" />
            <button type="submit">Logg inn</button>
            <div class="register-div">
                <Link href="/auth/sign-up" style={{ color: "var(--mdp-dark-text" }}>
                    Registrer deg her
                </Link>
            </div>
        </Form>
    );
});
