export const ADD_USER = "ADD_USER" as const;
export const REMOVE_USER_STREAM = "REMOVE_USER_STREAM" as const;
export const ADD_USER_NAME = "ADD_USER_NAME" as const;
export const ADD_ALL_USERS = "ADD_ALL_USERS" as const;


export const addUserAction = (userId : string, stream : MediaStream ) => ({
    type : ADD_USER,
    payload : {userId,stream},
});

export const removeUserStreamAction = (userId : string) => ({
    type : REMOVE_USER_STREAM,
    payload : {userId},
});

export const addUserNameAction = (userId : string, userName : string) => ({
    type : ADD_USER_NAME,
    payload : {userId, userName},
});

export const addAllUsersAction = (users:Record<string, {userName:string}>)=>({
    type:ADD_ALL_USERS,
    payload:{users},
})

