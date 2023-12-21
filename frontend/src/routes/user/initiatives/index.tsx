import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
// import { routeLoader$ } from "@builder.io/qwik-city";
// import SpServer from "~/supabase/spServer";
// export const useGetInitiatives = routeLoader$(async (reqEv) => {
//     const sp = new SpServer(reqEv);
//     const { data: sessionData } = await sp.get_session();
//     const { data } = await sp.get_user_initiatives_desc(sessionData.session?.user.id as string);
//     return data;
// });

export default component$(() => {
    useStylesScoped$(styles);
    // const data = useGetInitiatives();
    // useVisibleTask$(() => {
    //     console.log(data.value);
    // });
    return (
        <div>
            <h1>Dine insjer</h1>
            {/* {data.value?.map((init: any) => (
                <section key={init.id}>
                    <div>
                        {" "}
                        <h2>{init.initiatives.title}</h2>
                        <p>{init.initiatives.text}</p>
                        <i>vil ha med {init.initiatives.allowed_attendees} personer</i>
                        <h2>{init.initiatives.text.username}</h2>
                        <p>Kategori: {init.initiatives.category}</p>
                        <p>{init.initiatives.interested_count} har trykket kanskje</p>
                        <button>Kanseler insj</button>
                    </div>
                </section>
            ))} */}
        </div>
    );
});
