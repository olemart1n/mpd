import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { LuUserSquare } from "@qwikest/icons/lucide";
import styles from "./index.css?inline";
interface UiCard {
    username: string;
    gender: string;
    age: string;
    email: string;
    avatar: string;
}
type Prop = {
    props: UiCard;
};

export const UserCard = component$(({ props }: Prop) => {
    useStylesScoped$(styles);
    return (
        <div class="card-container">
            {props.avatar ? (
                <img src={props.avatar} alt={props.username} height={40} width={40} />
            ) : (
                <LuUserSquare class="icon" />
            )}

            <div>
                <h5>{props.username}</h5>
                <p>{props.age}</p>
            </div>
        </div>
    );
});
