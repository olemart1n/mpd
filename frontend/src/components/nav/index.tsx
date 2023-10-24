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
import { LuUserSquare, LuLogIn, LuUserPlus2 } from "@qwikest/icons/lucide";
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
    window.addEventListener("touchstart", (e) => {
      if (navIsToggled.value === false) return;
      if (
        drag.menu.value &&
        e.touches[0].clientX < drag.menu.value.offsetLeft
      ) {
        navIsToggled.value = false;
      }
    });
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
      <Link
        href="/"
        style={{
          color: "var(--dark)",
          width: "fit-content",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 style={{ width: "fit-content" }}>MedPåDet</h1>
      </Link>
      <section class={navIsToggled.value && "toggled"} ref={drag.menu}>
        {app.user ? (
          <ul>
            <li>
              <button onClick$={() => navigate("/user")}>
                <LuUserSquare class="nav-icon" />
                Bruker
              </button>
            </li>
            <li>
              <button onClick$={() => navigate("/user/initiatives")}>
                <LuUserSquare class="nav-icon" />
                Dine insjer
              </button>
            </li>

            <ButtonSignOut value={navIsToggled} />
          </ul>
        ) : (
          <ul>
            <li>
              <button onClick$={() => navigate("/auth/sign-in")}>
                <LuLogIn class="nav-icon" />
                Logg inn
              </button>
            </li>

            <li>
              <button onClick$={() => navigate("/auth/sign-up")}>
                <LuUserPlus2 class="nav-icon" />
                Registrer
              </button>
            </li>
          </ul>
        )}
      </section>
      <div class="toggle-button-div">
        <NavIcon value={navIsToggled} />
      </div>
    </nav>
  );
});
