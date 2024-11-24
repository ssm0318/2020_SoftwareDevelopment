import axios from 'axios';

import * as actionCreators from './user';
import store from '../store';

const stubUser = {
  id: 0,
  name: 'name 1',
  email: 'email 1',
  password: 'password 1',
};

describe('ActionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  // Implementation using `spyOn` API
  it(`'getUsers' should fetch users correctly`, (done) => {
    const stubUserList = [stubUser];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubUserList,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.getUsers()).then(() => {
      const newState = store.getState();
      expect(newState.usr.users).toBe(stubUserList);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'getUser' should fetch article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubUser,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.getUser()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'login' should sign user in correctly`, (done) => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubUser,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.login(stubUser)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'logout' should sign user out correctly`, (done) => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubUser,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.logout(stubUser)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
