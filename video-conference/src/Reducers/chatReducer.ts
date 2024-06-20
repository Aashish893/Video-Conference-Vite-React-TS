import { MessageType } from "../types/chat";
import { ADD_MESSAGE, ADD_HISTORY } from "./chatActions";

export type ChatState = {
    messages: MessageType[];
};
type ChatAction =
    | {
        type: typeof ADD_MESSAGE;
        payload: { message: MessageType };
    }
    | {
        type: typeof ADD_HISTORY;
        payload: { history: MessageType[] };
    }

export const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload.message],
            };
        case ADD_HISTORY:
            return {
                ...state,
                messages: action.payload.history,
            };
        default:
            return { ...state };
    }
};