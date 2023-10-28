import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import { LuUserCircle2 } from "@qwikest/icons/lucide";

interface CardType {
    id: string | undefined;
    title: string | undefined;
    category: string | undefined;
    author_id: string | undefined;
    author_username: string | null;
    attendees_count: string | null;
    allowed_attendees: string | null;
    date: string | null;
    avatar: string | null;
    time: string | null;
}

type CardInfo = {
    values: CardType;
};

export const CardInitiative = component$(({ values }: CardInfo) => {
    useStylesScoped$(styles);
    return (
        <Link
            href={"initiative/" + values.id}
            style={{
                color: "var(--dark)",
                textDecoration: "none",
                backgroundColor: "transparent",
            }}
        >
            <div class="meta-container">
                {" "}
                <div class={"meta " + values.category?.toString()}>
                    <p>{values.date?.substring(5, 10)}</p>
                    {values.avatar ? (
                        <img src={values.avatar} height={60} width={60} class="avatar" />
                    ) : (
                        <LuUserCircle2 class="avatar" />
                    )}
                    <p class="title">{values.title}</p>
                    <p>{values.time?.substring(0, 5)}</p>
                    <p class="count">
                        {values.attendees_count} / {values.allowed_attendees}
                    </p>
                </div>
            </div>
        </Link>
    );
});
