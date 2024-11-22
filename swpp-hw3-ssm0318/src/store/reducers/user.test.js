import React from 'react';

import reducer from './user';
import * as actionTypes from '../actions/actionTypes';

const stubUsers = [
    { id: 1, email: "swpp@snu.ac.kr", password: "iluvswpp", name: "Software Lover", logged_in: false },
    { id: 2, email: "alan@turing.com", password: "iluvswpp", name: "Alan Turing", logged_in: false },
    { id: 3, email: "edsger@dijkstra.com", password: "iluvswpp", name: "Edsger Dijkstra", logged_in: false }
];

describe('User Reducer', () => {
    it('should return default state', () => {
        const newState = reducer(undefined, {}); // initialize
        expect(newState).toEqual({ users: null, loggedInUser: null });
    });

    it('should login', () => {
        const loggedInUser = { ...stubUsers[0], logged_in: true };
        const stubInitialState = {
            users: stubUsers,
            loggedInUser: null,
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.LOGIN, 
            userID: 1,
        });
        expect(newState).toEqual({
            users: [loggedInUser, stubUsers[1], stubUsers[2]],
            loggedInUser: loggedInUser,
        });
    });

    it('should logout', () => {
        const loggedInUser = { ...stubUsers[0], logged_in: true };
        const stubInitialState = {
            users: [loggedInUser, stubUsers[1], stubUsers[2]],
            loggedInUser: loggedInUser,
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.LOGOUT,
            userID: 1,
        });
        expect(newState).toEqual({
            users: stubUsers,
            loggedInUser: null,
        });
    });

    it('should get user', () => {
        const newState = reducer(undefined, {
            type: actionTypes.GET_USER,
        });
        expect(newState).toEqual({
            users: null, loggedInUser: null,
        });
    });

    it('should get all users', () => {
        let newState = reducer(undefined, {
            type: actionTypes.GET_USERS,
            users: stubUsers,
        });
        expect(newState).toEqual({
            users: stubUsers, loggedInUser: null,
        });
    });
})

