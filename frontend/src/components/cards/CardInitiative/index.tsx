import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./index.css?inline";

interface CardType {
    id: string | undefined;
    title: string | undefined;
    category: string | undefined;
    author_id: string | undefined;
    author_username: string | null;
    interested_count: string | null;
}

type CardInfo = {
    values: CardType;
};

export const CardInitiative = component$(({ values }: CardInfo) => {
    useStylesScoped$(styles);
    return (
        <div>
            <Link
                href={"initiative/" + values.id}
                style={{
                    color: "var(--dark)",
                    textDecoration: "none",
                    backgroundColor: "transparent",
                }}
            >
                <section class="meta">
                    {" "}
                    <p>{values.title}</p>
                    <p>{values.category}</p>
                    <p>{values.author_username}</p>
                </section>

                <p class="count">{values.interested_count}</p>
            </Link>
        </div>
    );
});
