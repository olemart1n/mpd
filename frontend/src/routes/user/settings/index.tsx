import { component$ } from "@builder.io/qwik";

export default component$(() => {
    return <div>Hello Qwik!</div>;
});

// import { component$, useContext, useSignal, $, useStore, useVisibleTask$ } from "@builder.io/qwik";
// import { Form, routeAction$ } from "@builder.io/qwik-city";
// import SpBrowser from "~/supabase/spBrowser";
// import { appContext } from "~/context/appState";

// // foreløpig sendes bildet som der, fra klienten
// export default component$(() => {
//     const app = useContext(appContext);
//     const currentUpload = useSignal<string>("");
//     const fileInput = useSignal<HTMLInputElement>();
//     const sendImage = $(async (file?: File, fileType: string) => {
//         const sp = new SpBrowser();
//         // const { error, data } = await sp.send_file("avatar", "id", file, fileType);
//         // console.log(error);
//         // console.log(data);
//     });

//     return (
//         <Form
//             preventdefault:submit
//             style={{
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-evenly",
//             }}
//         >
//             <input type="text" name="id" id="id" value={app.user?.id} style={{ display: "none" }} />
//             {currentUpload.value && (
//                 <img
//                     src={currentUpload.value}
//                     alt="avatar"
//                     height={100}
//                     width={70}
//                     class="current-upload-image"
//                 />
//             )}

//             <input
//                 type="file"
//                 id="myFile"
//                 name="avatar"
//                 accept="image/*"
//                 ref={fileInput}
//                 onChange$={(e) => {
//                     if (e.target.files && e.target.files.length > 0) {
//                         currentUpload.value = URL.createObjectURL(e.target.files[0]); // this handles client image url before upload
//                     }
//                 }}
//                 hidden={currentUpload.value.length > 0 && true}
//             />
//             <button
//                 type="button"
//                 onClick$={() => {
//                     fileInput.value?.files &&
//                         sendImage(fileInput.value.files[0], fileInput.value.files[0].type);
//                 }}
//             >
//                 Last opp
//             </button>
//         </Form>
//     );
// });
