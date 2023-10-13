import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
interface UiCard {
    avatar: string | undefined;
    first_name: string | undefined;
    gender: string | undefined;
    age: string | undefined;
}

export const UiCardUSer = component$((props: UiCard) => {
    useStylesScoped$(styles);
    return (
        <div>
            <img src={props.avatar} alt={props.first_name} height={40} width={40} />

            <section>
                <h5>{props.first_name}</h5>
                <p>{props.age}</p>
            </section>
        </div>
    );
});
