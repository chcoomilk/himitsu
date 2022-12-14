import React, { createContext } from "react";
import { DefaultValues } from "../../../utils/constants";
import { EncryptionMethod } from "../../../utils/types";

export type NewNoteAction =
    | { type: "toggleModalReset" }
    | { type: "toggleModalExtraSettings" }
    | { type: "toggleHistory" }
    | { type: "setDefaultEncryption", payload: EncryptionMethod }

export type NewNoteState = {
    modals: {
        reset: boolean,
        extra_settings: boolean,
    },
    defaultEncryption: EncryptionMethod,
    history: boolean,
}

// starting to question my own sanity
// does this app really need reducers
// i can just put it in the useState
// why am i doing this to myself
export const reducer = (state: NewNoteState, action: NewNoteAction): NewNoteState => {
    switch (action.type) {
        case "toggleModalReset":
            return { ...state, modals: { ...state.modals, reset: !state.modals.reset } };
        case "toggleModalExtraSettings":
            return { ...state, modals: { ...state.modals, extra_settings: !state.modals.extra_settings } };
        case "setDefaultEncryption":
            return { ...state, defaultEncryption: action.payload };
        case "toggleHistory":
            return { ...state, history: !state.history };
        default:
            return state;
    }
};

// and i'm also starting to get really sick "initializing" contexts
// "readonly" even got replaced when page provider asks for value
// like why even bother then
const NewNoteContext = createContext<[NewNoteState, React.Dispatch<NewNoteAction>]>([
    {
        modals: { reset: false, extra_settings: false },
        defaultEncryption: DefaultValues.settings.encryption,
        history: DefaultValues.settings.history
    },
    () => { }
]);
export default NewNoteContext;
