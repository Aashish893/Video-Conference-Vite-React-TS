export const ADD_USER = "ADD_USER" as const;
export const REMOVE_USER = "REMOVE_USER" as const;
export const ADD_USER_NAME = "ADD_USER_NAME" as const;


export const addUserAction = (userId : string, stream : MediaStream ) => ({
    type : ADD_USER,
    payload : {userId,stream},
});

export const removeUserAction = (userId : string) => ({
    type : REMOVE_USER,
    payload : {userId},
});

export const addUserNameAction = (userId : string, userName : string) => ({
    type : ADD_USER_NAME,
    payload : {userId, userName},
});
