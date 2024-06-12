import { ADD_USER, REMOVE_USER } from "../ReactContexts/userActions";

export type UserState = Record<string,{stream : MediaStream}>

export type UserActions = 
|
{
    type : typeof ADD_USER, payload : {userId : string, stream : MediaStream}
} 
| 
{
    type : typeof REMOVE_USER, payload : {userId : string}
};

export const userReducer = (state : UserState, action : UserActions) => {
    switch(action.type){
        case ADD_USER:
            return{
                ...state, [action.payload.userId] : {stream : action.payload.stream}
            }
        case REMOVE_USER:
            const {[action.payload.userId] : deleted , ...rest} = state
            return rest
        default:
            return {...state}
    }
}