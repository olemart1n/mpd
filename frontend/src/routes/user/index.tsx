import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import { LuUserSquare, LuPenSquare } from "@qwikest/icons/lucide";
import { routeLoader$ } from "@builder.io/qwik-city";
import SpServer from "~/supabase/spServer";
import { UiModal } from "~/components/ui/uiModal";
import { UiButton } from "~/components/ui/uiButton";

export const useSpFetchProfile = routeLoader$(async (reqEv) => {
    const sp = new SpServer(reqEv);
    try {
        const { data: sessionData } = await sp.get_session();
        const { user } = await sp.get_logged_in_user_profile(
            "profiles",
            sessionData.session?.user.id as string
        );
        if (user) return { OK: true, user: user[0] };
    } catch (error) {
        return { OK: false, user: null };
    }
});

export default component$(() => {
    const fetch = useSpFetchProfile();
    const app = useContext(appContext);
    const fileInput = useSignal<HTMLInputElement>();
    const currentUpload = useSignal<string>();
    useStylesScoped$(styles);
    useVisibleTask$(({ track }) => {
        track(() => currentUpload.value);
        if (currentUpload.value) {
            app.dialogOpen = true;
        }
    });
    return (
        <div>
            {" "}
            {fetch.value?.OK ? (
                <section>
                    <div class="image-div">
                        <LuUserSquare class="profile-icon" />
                        <button class="add-image-button" onClick$={() => fileInput.value?.click()}>
                            <LuPenSquare />
                        </button>
                    </div>
                    <div class="info-div">
                        <h1>{fetch.value.user.username}</h1>

                        <p>{fetch.value.user.email}</p>
                    </div>
                    {/* component for understanding open/close logic */}
                    <UiModal>
                        <img
                            src={currentUpload.value}
                            alt="avatar"
                            height={100}
                            width={70}
                            class="current-upload-image"
                        />
                        <UiButton event$={() => console.log("hello")} class="success">
                            Last opp
                        </UiButton>
                    </UiModal>
                    <input
                        type="file"
                        id="myFile"
                        name="avatar"
                        accept="image/*"
                        ref={fileInput}
                        onChange$={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                currentUpload.value = URL.createObjectURL(e.target.files[0]); // this handles client image url before upload
                            }
                        }}
                        hidden
                    />
                    <button onClick$={() => (app.dialogOpen = true)}>hello</button>
                </section>
            ) : (
                <p>Kunne ikke laste inn bruker</p>
            )}
        </div>
    );
});
