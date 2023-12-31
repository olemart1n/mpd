import { component$, useSignal, useStylesScoped$, useVisibleTask$, $ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context";
import { LuUserSquare, LuPenSquare } from "@qwikest/icons/lucide";
import { routeLoader$ } from "@builder.io/qwik-city";
import { UiModal } from "~/components";
import { UiButton, UiLoader2 } from "~/components/ui";
import imageCompression from "browser-image-compression";
import BrowserClient from "~/supabase/browserClient";
export const useProfile = routeLoader$(async (reqEv) => {
    const sp = reqEv.sharedMap.get("serverClient");
    try {
        const { data: sessionData } = await sp.get_session();
        const { data: user } = await sp.get_by_id(
            "profiles",
            sessionData.session?.user.id as string
        );
        if (user) return { OK: true, user: user };
    } catch (error) {
        return { OK: false, user: null };
    }
});

export default component$(() => {
    const app = useContext(appContext);
    const fileInput = useSignal<HTMLInputElement>();
    const currentUpload = useSignal<string>();
    const isLoading = useSignal(false);
    useStylesScoped$(styles);
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => currentUpload.value);
        if (currentUpload.value) {
            app.dialogOpen = true;
        }
    });

    const sendToSp = $(async (file: File) => {
        isLoading.value = true;
        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.05,
                maxWidthOrHeight: 780,
                useWebWorker: true,
            });
            const sp = new BrowserClient();
            const { error } = await sp.send_file(
                "avatars",
                app.profile?.id as string,
                compressedFile,
                compressedFile.type
            );
            if (!error) {
                app.isNewProfileData = true;
                isLoading.value = false;
                app.dialogOpen = false;
                app.profile &&
                    (app.profile.avatar =
                        "https://oilmvgzqferfdqjvtsxz.supabase.co/storage/v1/object/public/avatars/52af9099-f0a1-443b-b081-fedd00c217ed" +
                        app.profile.id);
            }
        } catch (error) {
            console.log(error);
        }
    });

    return (
        <div>
            {app.profile ? (
                <section>
                    <div class="image-div">
                        {app.profile.avatar ? (
                            <img src={app.profile.avatar} height={100} width={100} />
                        ) : (
                            <>
                                {" "}
                                <LuUserSquare class="profile-icon" />
                                <button
                                    class="add-image-button"
                                    onClick$={() => fileInput.value?.click()}
                                >
                                    <LuPenSquare />
                                </button>
                            </>
                        )}
                    </div>
                    <div class="info-div">
                        <h1>{app.profile.username}</h1>

                        <p>{app.profile.email}</p>
                    </div>
                    <UiModal>
                        {currentUpload.value && (
                            <img
                                src={currentUpload.value}
                                alt="avatar"
                                height={100}
                                width={70}
                                class="current-upload-image"
                            />
                        )}
                        {isLoading.value ? (
                            <div class="loader-div">
                                <UiLoader2 />
                            </div>
                        ) : (
                            <UiButton
                                click$={() => {
                                    fileInput.value?.files && sendToSp(fileInput.value.files[0]);
                                }}
                                class="success"
                            >
                                Last opp
                            </UiButton>
                        )}
                    </UiModal>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        ref={fileInput}
                        onChange$={(e) => {
                            if (!e.target) return;
                            const target = e.target as HTMLInputElement;
                            if (target.files && target.files.length > 0) {
                                currentUpload.value = URL.createObjectURL(target.files[0]); // this handles client image url before upload
                            }
                        }}
                        hidden
                    />
                </section>
            ) : (
                <p>Kunne ikke laste inn bruker</p>
            )}
        </div>
    );
});
