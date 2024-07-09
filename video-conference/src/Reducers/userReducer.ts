import { ADD_USER, REMOVE_USER, ADD_USER_NAME } from "./userActions";

export type UserState = Record<string,{stream? : MediaStream, userName? : string}>;

export type UserActions = 
|
{
    type : typeof ADD_USER, payload : {userId : string, stream : MediaStream}
} 
| 
{
    type : typeof REMOVE_USER, payload : {userId : string}
}
| 
{
    type : typeof ADD_USER_NAME, payload : {userId : string, userName : string}
};

export const userReducer = (state : UserState, action : UserActions) => {
    console.log("Reducer action:", action);
    switch(action.type){
        case ADD_USER:
            return{
                ...state, [action.payload.userId] : {...state[action.payload.userId], stream : action.payload.stream}
            }
        case REMOVE_USER:
            return{...state, [action.payload.userId] : {...state[action.payload.userId], stream : undefined}}
            // const {[action.payload.userId] : deleted , ...rest} = state
            // return rest
        case ADD_USER_NAME:
            return{...state,[action.payload.userId] : {...state[action.payload.userName],userName : action.payload.userName}}
        default:
            return {...state}
    }
}