import {
    component$,
    useStylesScoped$,
    useContext,
    useSignal,
    $,
    type Signal,
    useTask$,
} from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import SpServer from "~/supabase/spServer";
import { appContext } from "~/context/appState";
import { UiButton, UiLoader, CardInitiative } from "~/components";
import { LuFilter } from "@qwikest/icons/lucide";
export const useSpFetch = routeLoader$(async (reqEv) => {
    const sp = new SpServer(reqEv);
    const { data: initiatives } = await sp.get_initiatives_desc();
    return { initiatives };
});

export default component$(() => {
    useStylesScoped$(styles);
    const fetchSignal = useSpFetch();
    const app = useContext(appContext);
    const nav = useNavigate();
    const isCategoriesDisplayed = useSignal(false);
    const filteredCategory = useSignal("siste insjer");
    const initiatives = useSignal(fetchSignal.value.initiatives);
    useTask$(({ track }) => {
        track(() => filteredCategory.value);
        if (!fetchSignal.value.initiatives) return;
        if (filteredCategory.value === "siste insjer") {
            initiatives.value = fetchSignal.value.initiatives;
        } else {
            initiatives.value = fetchSignal.value.initiatives.filter(
                (initiative) => initiative.category === filteredCategory.value
            );
        }
    });

    return fetchSignal.value.initiatives ? (
        <>
            <UiButton
                click$={() => (app.profile ? nav("/create-initiative") : nav("/auth/sign-in"))}
                class={!app.profile ? "error" : ""}
            >
                {!app.profile ? "Du må være innlogget for å insje" : "Lag en insj"}
            </UiButton>
            <div class="filter-div">
                {isCategoriesDisplayed.value ? (
                    <Categories category={filteredCategory} isCollapsed={isCategoriesDisplayed} />
                ) : (
                    <p>{filteredCategory.value}:</p>
                )}
                <button
                    onClick$={() => (isCategoriesDisplayed.value = !isCategoriesDisplayed.value)}
                >
                    <LuFilter class="filter-icon" />
                </button>
            </div>

            <section>
                {initiatives.value?.map((val: any) => <CardInitiative values={val} key={val.id} />)}
            </section>
        </>
    ) : (
        <div>
            <UiLoader />
        </div>
    );
});

export const head: DocumentHead = {
    title: "MedPåDet",
    meta: [
        {
            name: "description",
            content: "En side hvor du kan melde deg på aktiveter sammen med andre",
        },
    ],
};

// -
// -
// -
// --
// -
// -
// -
interface Signals {
    isCollapsed: Signal;
    category: Signal;
}
export const Categories = component$(({ isCollapsed, category }: Signals) => {
    useStylesScoped$(styles);
    const setCategory = $((e: any) => {
        category.value = e.target.textContent.toLowerCase();
        isCollapsed.value = false;
    });
    return (
        <div class="categories-component ">
            <button class="trening" onClick$={setCategory}>
                <p>Trening</p>
            </button>
            <button class="natur" onClick$={setCategory}>
                <p>Natur</p>
            </button>
            <button class="kultur" onClick$={setCategory}>
                <p>Kultur</p>
            </button>
            <button class="mat-drikke" onClick$={setCategory}>
                <p> Mat& drikke</p>
            </button>
            <button class="Siste Insjer" onClick$={setCategory}>
                <p>Siste Insjer</p>
            </button>
        </div>
    );
});
