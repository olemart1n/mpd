import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./index.css?inline";

interface CardType {
    id: string | undefined;
    title: string | undefined;
    category: string | undefined;
    author_id: string | undefined;
    author_name: string | null;
    interested_count: string | null;
}

type CardInfo = {
    values: CardType;
};

export const Card = component$(({ values }: CardInfo) => {
    useStylesScoped$(styles);
    return (
        <div>
            <Link
                href={"initiative/" + values.id}
                style={{
                    color: "var(--dark)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textDecoration: "none",
                }}
            >
                <h5>{values.author_name}</h5>
                <p>{values.title}</p>
                <p>{values.category}</p>

                <p class="count">{values.interested_count}</p>
            </Link>
        </div>
    );
});
