import { type DocumentHead } from "@builder.io/qwik-city";
import { component$, useStylesScoped$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Form, routeAction$, useNavigate } from "@builder.io/qwik-city";
import styles from "../index.css?inline";
import { appContext } from "~/context/appState";
import { useContext } from "@builder.io/qwik";
import { UxServerResponse, type UiResponse } from "~/components/ux/uxServerResponse";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const useSupabaseSignUp = routeAction$(async (form, reqEv) => {
    const { email, password, username, passwordControl, gender, age } = form;
    type MessageToClient = {
        message: string;
        status: string;
    };
    const messageToClient: MessageToClient = {
        message: "",
        status: "error",
    };
    if (password !== passwordControl) {
        messageToClient.message = "passord matcher ikke";
        messageToClient.status = "error";
        return messageToClient;
    }
    const sp = createServerClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        reqEv
    );
    const { data, error } = await sp.auth.signUp({
        email: email.toString(),
        password: password.toString(),
        options: {
            data: {
                username,
                gender,
                age,
            },
        },
    });
    const id = data.user?.id;
    if (id) {
        messageToClient.message = "Velkommen😀 Logg inn i neste steg";
        messageToClient.status = "success";
    }
    error?.message ? (messageToClient.message = error.message.toString()) : "error";
    return messageToClient;
});

//-------------------------------------------------------------------

export default component$(() => {
    const app = useContext(appContext);
    useStylesScoped$(styles);
    const action = useSupabaseSignUp();
    const nav = useNavigate();
    const statusMessage: UiResponse = useStore({
        message: undefined,
        status: undefined,
    });

    useVisibleTask$(({ track }) => {
        track(() => action.value);
        if (!action.value) return;
        app.navIconLoading = false;
        statusMessage.message = action.value.message;
        statusMessage.status = action.value.status;
        setTimeout(() => {
            nav("/auth/sign-in");
        }, 1500);
    });
    const ageArray = [];
    for (let i = 0; i < 100; i++) {
        ageArray.push(i);
    }
    return (
        <Form
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
            action={action}
            preventdefault:submit
        >
            <section>
                <div>
                    <label for="username">Brukernavn</label>
                    <input type="text" name="username" id="username" autoComplete="name" />
                </div>

                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" required autoComplete="email" />
                </div>
                <div>
                    <label for="password">Passord</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        autoComplete="current-password"
                        minLength={6}
                    />
                </div>
                <div>
                    <label for="passwordControl">Bekreft passord *</label>
                    <input
                        type="password"
                        name="passwordControl"
                        id="passwordControl"
                        required
                        autoComplete="current-password"
                        minLength={6}
                    />
                </div>

                <div class="div-form-age-gender">
                    <div>
                        <label for="gender">Kjønn</label>
                        <select name="gender" id="gender">
                            <option value="female">Kvinne</option>
                            <option value="not-specified">Ikke spesifiser</option>
                            <option value="male">Mann</option>
                        </select>
                    </div>
                    <div>
                        <label for="age">Alder</label>
                        <select name="age" id="age">
                            {ageArray.map((age) => (
                                <option value={age} key={age}>
                                    {age.toString()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <UxServerResponse message={statusMessage.message} status={statusMessage.status} />

                <button
                    type="submit"
                    onClick$={() => {
                        app.navIconLoading = true;
                    }}
                    disabled={app.navIconLoading && true}
                >
                    Registrer
                </button>
            </section>
        </Form>
    );
});

export const head: DocumentHead = {
    title: "MedPåDet",
    meta: [
        {
            name: "description",
            content: "Logg inn ",
        },
        {
            name: "viewport",
            content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
    ],
};
