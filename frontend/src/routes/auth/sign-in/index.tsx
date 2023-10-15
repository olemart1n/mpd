import { type DocumentHead } from "@builder.io/qwik-city";
import { component$, useStylesScoped$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Form, routeAction$, Link, useNavigate } from "@builder.io/qwik-city";
import styles from "../index.css?inline";
import { appContext } from "~/context/appState";
import { useContext } from "@builder.io/qwik";
import { StatusMessage, type ApiMessage } from "~/components/ui/statusMessage";
import SpServerClass from "~/supabase/spServer";
import { type User } from "supabase-auth-helpers-qwik";

export const useSupabaseLogin = routeAction$(async (form, reqEv) => {
    const { email, password } = form;
    type MessageToClient = {
        message: string;
        status: string;
        user: User | null; // Specify the User type for the 'user' property
    };
    const messageToClient: MessageToClient = {
        message: "",
        status: "error",
        user: null,
    };
    const sp = new SpServerClass(reqEv);
    const { data, error } = await sp.sign_in({
        email: email.toString(),
        password: password.toString(),
    });
    console.log(data, error);
    const id = data.user?.id;
    if (id) {
        messageToClient.message = "Du er innlogget";
        messageToClient.status = "success";
        messageToClient.user = data.user;
    }
    error?.message ? (messageToClient.message = error.message.toString()) : "error";
    return messageToClient;
});

//-------------------------------------------------------------------

export default component$(() => {
    const app = useContext(appContext);
    useStylesScoped$(styles);
    const action = useSupabaseLogin();
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

        if (action.value.user) {
            app.user = action.value.user;
            localStorage.setItem("user", JSON.stringify(action.value.user));
            setTimeout(() => {
                nav("/");
            }, 500);
        }
    });
    return (
        <Form
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
            action={action}
            preventdefault:submit
        >
            <h2>Logg inn</h2>
            <section>
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
                <StatusMessage message={statusMessage.message} status={statusMessage.status} />

                <button
                    type="submit"
                    onClick$={() => {
                        app.navIconLoading = true;
                    }}
                    disabled={app.navIconLoading && true}
                >
                    Logg inn
                </button>
            </section>
            <div class="register-div">
                <Link href="/auth/sign-up" style={{ color: "var(--dark" }}>
                    Registrer deg her
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
