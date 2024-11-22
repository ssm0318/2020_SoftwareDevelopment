import * as actionTypes from '../actions/actionTypes';

import axios from 'axios';
import { push } from 'connected-react-router';

export const login_ = (id) => {
    console.log("login called");
    return {
        type: actionTypes.LOGIN,
        userID: id
    };
};
  
export const login = (user) => {
    user.logged_in = true;
    return (dispatch) => {
        return axios.put(`/api/user/${user.id}/`, user)
            .then(res => dispatch(login_(parseInt(user.id))))
            .then(() => dispatch(push('/articles')));
    }
}

export const logout_ = (id) => {
    console.log("logout called");
    return {
        type: actionTypes.LOGOUT,
        userID: id
    };
};
  
export const logout = (user) => {
    user.logged_in = false;
    return (dispatch) => {
        return axios.put(`/api/user/${user.id}/`, user)
            .then(res => dispatch(logout_(parseInt(user.id))))
            .then(() => dispatch(push('/login')));
    }
}

export const getUser_ = user => {
    return { 
        type: actionTypes.GET_USER,
        user: user
    };
};

export const getUser = (id) => {
    return (dispatch) => {
        return axios.get(`/api/user/${id}/`)
        .then(res => dispatch(getUser_(res.data)));
    };
};

export const getUsers_ = (users) => {
    console.log("get users called");
    return {
        type: actionTypes.GET_USERS,
        users: users
    }
};

export const getUsers = () => {
    return (dispatch) => {
        return axios.get('/api/user')
            .then(res => dispatch(getUsers_(res.data)));
    };
}