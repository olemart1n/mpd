import { type Signal, component$, useStylesScoped$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
export interface AttendedGroups {
    title: string | null;
    id: string | null;
}

interface Values {
    groups: AttendedGroups[] | null | undefined;
    isToggled: Signal;
}

export const GroupLinks = component$(({ groups, isToggled }: Values) => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    return (
        <div>
            <p>Dine påmeldinger : {groups?.length}</p>
            {groups &&
                groups.map((group) => (
                    <button
                        onClick$={() => {
                            nav("/group/" + group.id);
                            isToggled.value = false;
                        }}
                        key={group.id}
                    >
                        {group.title}
                    </button>
                ))}
        </div>
    );
});
