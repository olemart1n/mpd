import { createContextId } from "@builder.io/qwik";

export interface User {
    id: string;
    auth: boolean;
}

export const userContext = createContextId<User>("user");
