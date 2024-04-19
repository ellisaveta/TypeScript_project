import { InputError } from "../sevices/http"

export function fieldErrors(error: unknown, fieldName: string) {
    if (!(error instanceof InputError)) {
        return;
    }

    return error.fieldErrors[fieldName];
}
