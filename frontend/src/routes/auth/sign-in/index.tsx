import { type DocumentHead } from "@builder.io/qwik-city";
import { component$, useStylesScoped$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Form, routeAction$, Link, useNavigate } from "@builder.io/qwik-city";
import styles from "../index.css?inline";
import { appContext } from "~/context";
import { useContext } from "@builder.io/qwik";
import { UxServerResponse, type UiResponse } from "~/components/";
import { UiButton } from "~/components";
export interface ProfileInterface {
    id: string | null;
    updated_at: string | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    gender: string | null;
    email: string | null;
    avatar: string | null;
    age: string | null;
    attended_groups: AttendedGroups[] | null;
}

interface AttendedGroups {
    title: string | null;
    id: string | null;
}

export const useSupabaseLogin = routeAction$(async (form, reqEv) => {
    const { origin } = reqEv.url;
    const { cookie } = reqEv;
    const { email, password } = form;
    interface MessageToClient {
        message: string;
        status: string;
        profile: ProfileInterface | null;
    }
    const messageToClient: MessageToClient = {
        message: "",
        status: "error",
        profile: null,
    };
    const sp = reqEv.sharedMap.get("serverClient");
    const { data, error } = await sp.auth.signInWithPassword({
        email: email.toString(),
        password: password.toString(),
    });
    //----------------set cookie for mobile dev
    if (origin === "http://192.168.10.175:4173" || origin === "http://192.168.10.175:5173") {
        const cookieArray = JSON.stringify([
            data.session?.access_token,
            data.session?.refresh_token,
            null,
            null,
            null,
        ]);
        cookie.set("supabase-auth-token", cookieArray, {
            httpOnly: true,
            maxAge: [1, "hours"],
            path: "/",
            sameSite: "lax",
            secure: false,
        });
    }

    const id = data.user?.id;
    const { data: profile } = await sp
        .from("profiles")
        .select("*, imdown(initiatives(title, groups(id)))")
        .eq("id", id)
        .single();

    if (id && profile) {
        const { imdown, ...rest } = profile;

        const attended_groups = imdown.map((x: any) => {
            return { title: x?.initiatives?.title, id: x?.initiatives?.groups?.id };
        });
        const profileState = { ...rest, attended_groups };
        messageToClient.message = "Du er innlogget";
        messageToClient.status = "success";
        messageToClient.profile = profileState;
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
    const statusMessage: UiResponse = useStore({
        message: undefined,
        status: undefined,
    });
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => action.value);
        if (!action.value) return;
        app.navIconLoading = false;
        statusMessage.message = action.value.message;
        statusMessage.status = action.value.status;

        if (action.value.profile) {
            app.profile = action.value.profile;
            localStorage.setItem("profile", JSON.stringify(action.value.profile));
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
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        autoComplete="email"
                        placeholder="123@abc.no"
                    />
                </div>
                <div>
                    <label for="password">Passord</label>
                    <input
                        placeholder="pAAƨƨ0rd"
                        type="password"
                        name="password"
                        id="password"
                        required
                        autoComplete="current-password"
                        minLength={6}
                    />
                </div>
                <UxServerResponse message={statusMessage.message} status={statusMessage.status} />

                <UiButton
                    class="success"
                    click$={() => {
                        app.navIconLoading = true;
                    }}
                    disabled={app.navIconLoading && true}
                >
                    Logg inn
                </UiButton>
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
