import * as actionTypes from '../actions/actionTypes';

const initialState = {
    users: JSON.parse(localStorage.getItem("users")),
    loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")),
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            let loggedInUser = null;
            const loginUsers = state.users.map((user) => {
                if (user.id === action.userID) {
                    loggedInUser = { ...user, logged_in: true };
                    return loggedInUser;
                } else {
                    return { ...user }
                }
            });
            localStorage.setItem("loggedInUser", JSON.stringify( loggedInUser ));
            localStorage.setItem("users", JSON.stringify( loginUsers ));
            return { ...state, users: loginUsers, loggedInUser: loggedInUser };
        case actionTypes.LOGOUT:
            const logoutUsers = state.users.map((user) => {
                if (user.id === action.userID) {
                    return { ...user, logged_in: false };
                } else {
                    return { ...user }
                }
            });
            localStorage.setItem("loggedInUser", null);
            localStorage.setItem("users", JSON.stringify( logoutUsers ));
            return { ...state, users: logoutUsers, loggedInUser: null };
        case actionTypes.GET_USER:
            return { ...state };
        case actionTypes.GET_USERS:
            localStorage.setItem("users", JSON.stringify( action.users ));
            return { ...state, users: action.users }
        default:
            break;
    }
    return state;
};

export default reducer;