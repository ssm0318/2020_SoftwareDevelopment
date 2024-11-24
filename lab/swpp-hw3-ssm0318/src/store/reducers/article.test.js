import React from 'react';

import reducer from './article';
import * as actionTypes from '../actions/actionTypes';

const stubArticles = [
    { id: 1, author_id: 0, title: '1', content: '1' },
    { id: 3, author_id: 1, title: '3', content: '3' },
    { id: 2, author_id: 0, title: '2', content: '2' },
];

const stubNewArticle = {
    id: 4,
    author_id: 2,
    title: '4',
    content: '4',
};

describe('Article Reducer', () => {
    it('should return default state', () => {
        const newState = reducer(undefined, {}); // initialize
        expect(newState).toEqual({ articles: null, selectedArticle: null, lastArticleID: null });
    });

    it('should post article', () => {
        const stubInitialState = {
            articles: stubArticles,
            selectedArticle: null,
            lastArticleID: 0,
        };
        const newState = reducer(stubInitialState, {
            type: actionTypes.POST_ARTICLE,
            id: stubNewArticle.id,
            author_id: stubNewArticle.author_id,
            title: stubNewArticle.title,
            content: stubNewArticle.content,
        });
        expect(newState).toEqual({
            articles: [...stubArticles, stubNewArticle],
            selectedArticle: null,
            lastArticleID: 4,
        });
    });

    it('should delete article', () => {
        const stubInitialState = {
            articles: [ stubNewArticle, ...stubArticles],
            selectedArticle: null,
            lastArticleID: 4,
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.DELETE_ARTICLE,
            id: 4,
        });
        expect(newState).toEqual({
            articles: stubArticles,
            selectedArticle: null,
            lastArticleID: 3,
        });
        newState = reducer(newState, {
            type: actionTypes.DELETE_ARTICLE,
            id: 1,
        });
        expect(newState).toEqual({
            articles: [stubArticles[1], stubArticles[2]],
            selectedArticle: null,
            lastArticleID: 3,
        });
        newState = reducer(newState, {
            type: actionTypes.DELETE_ARTICLE,
            id: 3,
        });
        expect(newState).toEqual({
            articles: [stubArticles[2]],
            selectedArticle: null,
            lastArticleID: 2,
        });
        newState = reducer(newState, {
            type: actionTypes.DELETE_ARTICLE,
            id: 2,
        });
        expect(newState).toEqual({
            articles: [],
            selectedArticle: null,
            lastArticleID: -1,
        });
    });

    it('should edit article', () => {
        const modifiedArticle = { ...stubArticles[0], title: "new title", content: "new content" };
        const stubInitialState = {
            articles: [stubNewArticle, stubArticles[0]],
            selectedArticle: null,
            lastArticleID: 4,
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.EDIT_ARTICLE,
            id: modifiedArticle.id,
            author_id: modifiedArticle.author_id,
            title: modifiedArticle.title,
            content: modifiedArticle.content,
        });
        expect(newState).toEqual({
            articles: [stubNewArticle, modifiedArticle],
            selectedArticle: null,
            lastArticleID: 4,
        });
    });

    it('should get article', () => {
        const stubSelectedArticle = stubNewArticle;
        const newState = reducer(undefined, {
            type: actionTypes.GET_ARTICLE,
            article: stubSelectedArticle,
        });
        expect(newState).toEqual({
            articles: null,
            selectedArticle: stubSelectedArticle,
            lastArticleID: null,
        });
    });

    it('should get all articles', () => {
        let newState = reducer(undefined, {
            type: actionTypes.GET_ARTICLES,
            articles: stubArticles,
        });
        expect(newState).toEqual({
            articles: stubArticles,
            selectedArticle: null,
            lastArticleID: 3,
        });
        newState = reducer(undefined, {
            type: actionTypes.GET_ARTICLES,
            articles: [],
        });
        expect(newState).toEqual({
            articles: [],
            selectedArticle: null,
            lastArticleID: -1,
        });
    });
});