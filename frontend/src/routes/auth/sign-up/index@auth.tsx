import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import styles from "../index.css?inline";
export default component$(() => {
    useStylesScoped$(styles);
    return (
        <Form style={{ display: "flex", flexDirection: "column" }}>
            <h2>Registrer bruker</h2>
            <label for="first-name">Hva heter du?</label>
            <input type="text" name="first-name" id="first-name" placeholder="Kari" />

            <label for="email">Mail addresse</label>
            <input type="email" name="email" id="email" placeholder="mail@mail.com" />
            <label for="password">Passord</label>
            <input
                type="password"
                name="password"
                id="password"
                placeholder="inkluder 1 spesialtegn"
            />
            <label for="gender">Kjønn</label>
            <select name="gender">
                <option value="">Velg</option>
                <option value="female">Kvinne</option>
                <option value="male">Mann</option>
                <option value="not-specified">Ikke spesifiser</option>
            </select>
            <button type="submit">Logg inn</button>
            <div class="register-div">
                <Link href="/auth/sign-up" style={{ color: "var(--mdp-dark-text" }}>
                    Registrer deg her
                </Link>
            </div>
        </Form>
    );
});
