import { component$, useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

const stream = server$(async function* () {
    for (let i = 0; i < 10; i++) {
        yield i;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
});

export default component$(() => {
    const message = useSignal("");
    return (
        <div>
            <button
                onClick$={async () => {
                    const response = await stream();
                    for await (const i of response) {
                        message.value += ` ${i}`;
                    }
                }}
            >
                start
            </button>
            <div>{message.value}</div>
        </div>
    );
});
