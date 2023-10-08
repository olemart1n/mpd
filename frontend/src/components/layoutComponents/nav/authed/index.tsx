import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import { LuMoreVertical } from "@qwikest/icons/lucide";
export const Header = component$(() => {
    useStylesScoped$(styles);
    return (
        <header>
            <nav>
                <Link href="/">
                    <h1>MedPåDet</h1>
                </Link>
                <input class="checkbox" type="checkbox" name="" id="checkbox" checked={false} />
                <LuMoreVertical class="mobile-nav-toggle" />
                <ul>
                    <li>
                        <Link>Instillinger</Link>
                    </li>
                    <li>
                        <Link>Meldinger</Link>
                    </li>
                    <button>Logg ut</button>
                </ul>
            </nav>
        </header>
    );
});
