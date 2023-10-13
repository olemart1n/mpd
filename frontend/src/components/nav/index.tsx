import {
    component$,
    useStylesScoped$,
    useContext,
    useSignal,
    $,
    useVisibleTask$,
    useStore,
} from "@builder.io/qwik";
import styles from "./index.css?inline";
// import { ButtonLogin } from "./ButtonLogin";
import { ButtonSignOut } from "./ButtonSignOut";
import { NavIcon } from "./NavIcon";
import { appContext } from "~/context/appState";
import { useNavigate, Link } from "@builder.io/qwik-city";
export const Nav = component$(() => {
    const app = useContext(appContext);
    const nav = useNavigate();
    const navIsToggled = useSignal(false);
    const drag = useStore({
        menu: useSignal<HTMLElement>(),
        isDragging: useSignal(false),
        startX: 0,
    });
    useStylesScoped$(styles);
    const navigate = $((destination: string) => {
        nav(destination);
        navIsToggled.value = false;
    });
    useVisibleTask$(() => {
        drag.menu.value?.addEventListener("touchstart", (e: any) => {
            drag.startX = e.touches[0].clientX;
        });
        drag.menu.value?.addEventListener("touchmove", (e: any) => {
            if (drag.startX === 0) return;
            const currentX = e.touches[0].clientX;
            const deltaX = currentX - drag.startX;
            if (deltaX > 0) {
                navIsToggled.value = false;
            }
        });
        drag.menu.value?.addEventListener("touchend", () => {
            drag.startX = 0;
        });
    });
    return (
        <nav>
            <Link href="/" style={{ color: "var(--dark)", width: "fit-content" }}>
                <h1 style={{ width: "fit-content" }}>MedPåDet</h1>
            </Link>
            <section class={navIsToggled.value && "toggled"} ref={drag.menu}>
                {app.user ? (
                    <ul>
                        <li>
                            <button onClick$={() => navigate("/user")}>Bruker</button>
                        </li>

                        <li>
                            <ButtonSignOut value={navIsToggled} />
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
