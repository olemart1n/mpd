import { type DocumentHead } from "@builder.io/qwik-city";
import { component$, useStylesScoped$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Form, routeAction$, Link, useNavigate } from "@builder.io/qwik-city";
import styles from "../index.css?inline";
import { appContext } from "~/context/appState";
import { useContext } from "@builder.io/qwik";
import { StatusMessage, type ApiMessage } from "~/components/ui/statusMessage";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const useSupabaseSignUp = routeAction$(async (form, reqEv) => {
    const { email, password, first_name, gender } = form;
    type MessageToClient = {
        message: string;
        status: string;
    };
    const messageToClient: MessageToClient = {
        message: "",
        status: "error",
    };
    const sp = createServerClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_API_KEY,
        reqEv
    );
    const { data, error } = await sp.auth.signUp({
        email: email.toString(),
        password: password.toString(),
        options: {
            data: {
                first_name,
                gender,
                user_image: `${
                    import.meta.env.PUBLIC_SUPABASE_URL
                }/storage/v1/object/public/avatar/`,
                initiatives: [],
            },
        },
    });
    console.log(data, error);
    const id = data.user?.id;
    if (id) {
        messageToClient.message = "Vent litt";
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
    const statusMessage: ApiMessage = useStore({
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
            nav("/");
        }, 500);
    });
    return (
        <Form
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
            action={action}
            preventdefault:submit
        >
            <section>
                <label for="first_name">Hva heter du?</label>
                <input type="text" name="first_name" id="first_name" autoComplete="name" />
                <label for="email">Email</label>
                <input type="email" name="email" id="email" required autoComplete="email" />
                <label for="password">Passord</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    autoComplete="current-password"
                    minLength={6}
                />

                <label for="gender">Kjønn</label>
                <select name="gender" id="gender">
                    <option value="not-specified">Velg</option>
                    <option value="female">Kvinne</option>
                    <option value="male">Mann</option>
                    <option value="not-specified">Ikke spesifiser</option>
                </select>
                <StatusMessage message={statusMessage.message} status={statusMessage.status} />

                <button
                    type="submit"
                    onClick$={() => {
                        app.navIconLoading = true;
                    }}
                    disabled={app.navIconLoading && true}
                >
                    Register
                </button>
            </section>
            <div class="register-div">
                <Link href="/auth/sign-in" style={{ color: "var(--dark" }}>
                    Logg inn
                </Link>
            </div>
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
