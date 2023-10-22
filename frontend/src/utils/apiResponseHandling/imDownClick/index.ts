import { type PostgrestError } from "@supabase/supabase-js";
export const imDownClickErrorHandling = (
    error: PostgrestError | null
): { message: string; status: string } => {
    const apiResponse = { message: "", status: "" };
    if (!error) {
        apiResponse.message = "Du er med!";
        apiResponse.status = "success";
    } else if (error.code === "23505") {
        apiResponse.message = "Du kan ikke bli mer enn en gang";
        apiResponse.status = "error";
    } else if (error.code === "42501") {
        apiResponse.message = "Du må logge inn.";
        apiResponse.status = "error";
    } else {
        apiResponse.message = error.message;
        apiResponse.status = "error";
    }
    return apiResponse;
};
