import { MessageType } from "../types/chat";
import { ADD_MESSAGE, ADD_HISTORY, TOGGLE_CHAT } from "./chatActions";

export type ChatState = {
    messages: MessageType[];
    isChatOpen : boolean;
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
    |
    {
        type: typeof TOGGLE_CHAT;
        payload: { isChatOpen: boolean };
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
        case TOGGLE_CHAT:
            return {
                ...state,
                isChatOpen : action.payload.isChatOpen,
            }
        default:
            return { ...state };
    }
};