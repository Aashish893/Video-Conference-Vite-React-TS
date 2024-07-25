import { ADD_USER, REMOVE_USER_STREAM, ADD_USER_NAME, ADD_ALL_USERS } from "./userActions";

export type UserState = Record<string,{stream? : MediaStream, userName? : string}>;

export type UserActions = 
|
{
    type : typeof ADD_USER, payload : {userId : string, stream : MediaStream}
} 
| 
{
    type : typeof REMOVE_USER_STREAM, payload : {userId : string}
}
| 
{
    type : typeof ADD_USER_NAME, payload : {userId : string, userName : string}
}
|
{
    type:typeof ADD_ALL_USERS; payload : {users:Record<string, {userName:string}>}
};

export const userReducer = (state : UserState, action : UserActions) => {
    console.log(action, " THIS IS THE ACTION !! ", state);
    switch(action.type){
        case ADD_USER:
            return{
                ...state, [action.payload.userId] : {...state[action.payload.userId], stream : action.payload.stream}
            }
        case REMOVE_USER_STREAM:
            // return{...state, [action.payload.userId] : {...state[action.payload.userId], stream : undefined}}
            return {...state,[action.payload.userId]: {...state[action.payload.userId],stream: undefined,},};
            // const {[action.payload.userId] : deleted , ...rest} = state
            // return rest
        case ADD_USER_NAME:
            return{...state,[action.payload.userId] : {...state[action.payload.userId],userName : action.payload.userName}}
        case ADD_ALL_USERS:
            // return {...state, ...action.payload.users}
            const updatedState = { ...state };
            for (const [userId, userData] of Object.entries(action.payload.users)) {
                if (updatedState[userId]) {
                    // Preserve existing userName if it exists
                    updatedState[userId] = {
                        ...updatedState[userId],
                        userName: userData.userName,
                    };
                } else {
                    // Add new user
                    updatedState[userId] = { userName: userData.userName };
                }
            }
            return updatedState;
        default:
            return {...state}
    }
}