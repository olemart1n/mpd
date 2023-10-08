import { component$, useStylesScoped$, useContext, useSignal, $ } from "@builder.io/qwik";
import styles from "./index.css?inline";
// import { ButtonLogin } from "./ButtonLogin";
import { ButtonSignOut } from "./ButtonSignOut";
import { NavIcon } from "./NavIcon";
import { appContext } from "~/context/appState";
import { useNavigate } from "@builder.io/qwik-city";
export const Nav = component$(() => {
    const app = useContext(appContext);
    const nav = useNavigate();
    const navIsToggled = useSignal(false);
    useStylesScoped$(styles);
    const navigate = $((destination: string) => {
        nav(destination);
        navIsToggled.value = false;
    });
    return (
        <nav>
            <a href="/">
                <h1>MedPåDet</h1>
            </a>
            <section class={navIsToggled.value && "toggled"}>
                {app.user ? (
                    <ul>
                        <li>
                            <button onClick$={() => navigate("/user")}>Bruker</button>
                        </li>

                        <li>
                            <ButtonSignOut />
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <button onClick$={() => navigate("/auth/sign-in")}>Logg inn</button>
                        </li>

                        <li>
                            <button onClick$={() => navigate("/auth/sign-up")}>Registrer</button>
                        </li>
                    </ul>
                )}
            </section>
            <div class="toggle-button-div">
                <NavIcon value={navIsToggled} />
            </div>

            {/* <ButtonLogin /> */}
        </nav>
    );
});
