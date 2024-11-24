import axios from 'axios';

import * as actionCreators from './comment';
import store from '../store';

const stubComment = {
  id: 0,
  article_id: 0,
  author_id: 0,
  content: 'content 1'
};

const stubArticle = {
    id: 0,
    author_id: 0,
    title: 'title 1',
    content: 'content 1',
}

describe('ActionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  // Implementation using `spyOn` API
  it(`'getComments' should fetch comments correctly`, (done) => {
    const stubCommentList = [stubComment];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubCommentList,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.getComments()).then(() => {
      const newState = store.getState();
      expect(newState.cm.comments).toBe(stubCommentList);
      expect(newState.cm.lastCommentID).toBe(0);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'getComment' should fetch comment correctly`, (done) => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubComment,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.getComment()).then(() => {
      const newState = store.getState();
      expect(newState.cm.selectedComment).toBe(stubComment);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'postComment' should post comment correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation((url, cm) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubComment
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.postComment(stubComment)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'deleteComment' should delete comment correctly`, (done) => {
    const spy = jest.spyOn(axios, 'delete')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: null,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.deleteComment(stubComment)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'editComment' should edit comment correctly`, (done) => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubComment,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.editComment(stubComment)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
