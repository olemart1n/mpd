import { RouterHead } from "./components/router-head/router-head";
import "./global.css";
import { component$, useContextProvider, useStore } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { type User, userContext } from "./context/user";

export default component$(() => {
    const userSession: User = useStore({ id: "", auth: false });
    /**
     * The root of a QwikCity site always start with the <QwikCityProvider> component,
     * immediately followed by the document's <head> and <body>.
     *
     * Don't remove the `<head>` and `<body>` elements.
     */
    useContextProvider(userContext, userSession);
    return (
        <QwikCityProvider>
            <head>
                <meta charSet="utf-8" />
                <link rel="manifest" href="/manifest.json" />
                <RouterHead />
                <ServiceWorkerRegister />
            </head>
            <body lang="en">
                <RouterOutlet />
            </body>
        </QwikCityProvider>
    );
});
