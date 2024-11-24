import axios from 'axios';

import * as actionCreators from './article';
import store from '../store';

const stubArticle = {
  id: 0,
  author_id: 0,
  title: 'title 1',
  content: 'content 1',
};

describe('ActionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  // Implementation using `spyOn` API
  it(`'getArticles' should fetch articles correctly`, (done) => {
    const stubArticleList = [stubArticle];

    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubArticleList,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.getArticles()).then(() => {
      const newState = store.getState();
      expect(newState.atc.articles).toBe(stubArticleList);
      expect(newState.atc.lastArticleID).toBe(0);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'getArticle' should fetch article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubArticle,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.getArticle()).then(() => {
      const newState = store.getState();
      expect(newState.atc.selectedArticle).toBe(stubArticle);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'postArticle' should post article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation((url, atc) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubArticle
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.postArticle(stubArticle)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'deleteArticle' should delete article correctly`, (done) => {
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

    store.dispatch(actionCreators.deleteArticle()).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'editArticle' should edit article correctly`, (done) => {
    const spy = jest.spyOn(axios, 'put')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubArticle,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.editArticle(stubArticle)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
