import React, { createContext, useContext } from "react";
import { EncryptionMethod } from "../../../utils/types";

type NewNoteAction =
    | { type: "toggleModalReset" }
    | { type: "toggleModalExtraSettings" }
    | { type: "toggleAlwaysSaveOnSubmit" }
    | { type: "toggleExtraSettingsStaticHeight" }
    | { type: "toggleSimpleMode" }
    | { type: "toggleMustExpire" }
    | { type: "incrementTextAreaRow" }
    | { type: "decrementTextAreaRow" }
    | { type: "setDefaultEncryption", payload: EncryptionMethod }
    | { type: "setTextAreaRow", payload: number }

type NewNoteState = {
    modals: {
        reset: boolean,
        extra_settings: boolean,
        extra_settings_static_height: boolean,
    },
    defaultEncryption: EncryptionMethod,
    alwaysSaveOnSubmit: boolean,
    textAreaRow: number,
    simpleMode: boolean,
    mustExpire: boolean,
}

type NewNoteReducer = React.Reducer<NewNoteState, NewNoteAction>

export const reducer: NewNoteReducer = (state, action) => {
    switch (action.type) {
        case "toggleModalReset":
            return { ...state, modals: { ...state.modals, reset: !state.modals.reset } };
        case "toggleModalExtraSettings":
            return { ...state, modals: { ...state.modals, extra_settings: !state.modals.extra_settings } };
        case "setDefaultEncryption":
            return { ...state, defaultEncryption: action.payload };
        case "toggleAlwaysSaveOnSubmit":
            return { ...state, alwaysSaveOnSubmit: !state.alwaysSaveOnSubmit };
        case "decrementTextAreaRow":
            return { ...state, textAreaRow: state.textAreaRow - 1 };
        case "incrementTextAreaRow":
            return { ...state, textAreaRow: state.textAreaRow + 1 };
        case "setTextAreaRow":
            return { ...state, textAreaRow: action.payload };
        case "toggleExtraSettingsStaticHeight":
            return {
                ...state, modals: {
                    ...state.modals,
                    extra_settings_static_height: !state.modals.extra_settings_static_height
                }
            };
        case "toggleSimpleMode":
            return {
                ...state, simpleMode: !state.simpleMode,
            };
        case "toggleMustExpire":
            return {
                ...state, mustExpire: !state.mustExpire,
            };
        default:
            return state;
    }
};

export const NewNoteContext = createContext<[NewNoteState, React.Dispatch<NewNoteAction>] | undefined>(undefined);

const useNewNoteContext = () => {
    const context = useContext(NewNoteContext);

    if (!context) {
        throw new Error("useNewNoteContext is outside NewNote.Provider");
    }

    return context;
}

export default useNewNoteContext;
