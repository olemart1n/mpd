import {
    component$,
    useSignal,
    useStylesScoped$,
    $,
    useVisibleTask$,
    useStore,
} from "@builder.io/qwik";
import { Form, routeAction$, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import SpServer from "~/supabase/spServer";
import { useContext } from "@builder.io/qwik";
import { appContext } from "~/context/appState";
import type { ApiMessage } from "~/components/ui/statusMessage";
import { StatusMessage } from "~/components/ui/statusMessage";
export const useSpCreateInsj = routeAction$(async (form, reqEv) => {
    const sp = new SpServer(reqEv);
    const { data, error } = await sp.post("initiatives", form);

    return { data, error };
});

export default component$(() => {
    const app = useContext(appContext);
    const nav = useNavigate();
    const action = useSpCreateInsj();
    useStylesScoped$(styles);
    const numbersArray = [];
    for (let i = 1; i <= 20; i++) {
        numbersArray.push(i);
    }
    const currentDate = useSignal(new Date().toISOString().slice(0, 10));
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, "0");
    const currentMinute = now.getMinutes().toString().padStart(2, "0");
    const currentTime = useSignal(currentHour + ":" + currentMinute);
    const handleDateChange = $(() => {
        (e: HTMLInputElement) => {
            currentDate.value = e.value;
        };
    });
    const handleTimeChange = $(() => {
        (e: HTMLInputElement) => {
            currentTime.value = e.value;
        };
    });
    const statusMessage = useStore<ApiMessage>({ message: undefined, status: undefined });
    useVisibleTask$(({ track }) => {
        track(() => action.value);
        if (!action.status) return;

        if (!action.value?.error) {
            statusMessage.status = "success";
            statusMessage.message = "Du har postet en insj";
            setTimeout(() => {
                nav("/");
            }, 1200);
        } else {
            statusMessage.status = "error";
            statusMessage.message = "Et problem oppsto, prøv igjen senere";
        }
    });
    return (
        <Form preventdefault:submit action={action}>
            <input type="text" name="author_id" id="author_id" hidden value={app.user?.id} />
            <input
                type="text"
                name="author_name"
                id="author_name"
                hidden
                value={app.user?.user_metadata.first_name}
            />
            <input
                type="text"
                name="author_name"
                id="author_name"
                hidden
                value={app.user?.user_metadata.first_name}
            />
            <div class="form-div">
                <label for="title">Tittel</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="max 12 tegn"
                    maxLength={12}
                    required
                />
            </div>
            <div class="number-of-attendees form-div">
                <label for="allowed_attendees">Antall</label>
                <select name="allowed_attendees" id="allowed_attendees" required>
                    <option value="not-specified">Ikke viktig</option>
                    {numbersArray.map((num, i) => (
                        <option key={num} value={i}>
                            {i.toString()}
                        </option>
                    ))}
                </select>
            </div>
            <div class="date form-div">
                <label for="date">Hvilken dag?</label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={currentDate.value}
                    required
                    onChange$={handleDateChange}
                />
            </div>
            <div class="clock form-div">
                <label for="clock">Klokka</label>
                <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    value={currentTime.value}
                    onChange$={handleTimeChange}
                />
            </div>

            <div class="category form-div">
                <label for="category">Kategori</label>
                <select name="category" id="category">
                    <option value="egendefiner">Egendefiner</option>
                    <option value="natur">Natur</option>
                    <option value="kultur">Kultur</option>
                    <option value="trene">Trene</option>
                    <option value="spill">Spill</option>
                    <option value="foreldre-med-barn">Foreldre med barn</option>
                </select>
            </div>
            <div class="textarea-div form-div">
                <label for="text">Hva hadde du tenkt?</label>
                <textarea name="text" id="text" cols={30} rows={5} required></textarea>
            </div>
            <StatusMessage message={statusMessage.message} status={statusMessage.status} />
            <button type="submit">INSJ!</button>
        </Form>
    );
});

export const head: DocumentHead = {
    title: "MedPåDet",
    meta: [
        {
            name: "description",
            content: "Lag en insj",
        },
        {
            name: "viewport",
            content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
    ],
};
