export const ADD_USER = "ADD_PEER" as const;
export const REMOVE_USER = "REMOVE_PEER" as const;


export const addUserAction = (userId : string, stream : MediaStream ) => ({
    type : ADD_USER,
    payload : {userId,stream},
});

export const removeUserAction = (userId : string) => ({
    type : REMOVE_USER,
    payload : {userId},
});
