import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
interface UiCard {
    gender: string;
    username: string;
    age: string;
}
type Prop = {
    props: UiCard;
};

export const UserCardLight = component$(({ props }: Prop) => {
    useStylesScoped$(styles);
    return (
        <div>
            <p>{props.username}</p>
            <p>{props.age}</p>
        </div>
    );
});
