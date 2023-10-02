import { useContext, component$, useStylesScoped$ } from "@builder.io/qwik";
import { userContext } from "~/context/user";
import { Link } from "@builder.io/qwik-city";
import styles from "./index.css?inline";

export default component$(() => {
    useStylesScoped$(styles);
    const user = useContext(userContext);
    return (
        <header>
            <Link href="/" style={{ textDecoration: "none", color: "var(--mdp-text-dark)" }}>
                <h1>medPåDet</h1>
            </Link>
            {user.auth && <ProfileButton />}
            {!user.auth && <LoginButton />}
        </header>
    );
});

const LoginButton = () => {
    return (
        <Link
            href="/auth/sign-in"
            style={{ textDecoration: "none", color: "var(--mdp-text-dark)" }}
        >
            Logg inn
        </Link>
    );
};
const ProfileButton = () => {
    return (
        <Link href="/user" style={{ textDecoration: "none", color: "var(--mdp-text-dark)" }}>
            Din bruker
        </Link>
    );
};
