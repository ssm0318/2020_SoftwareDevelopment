import React from 'react';

import reducer from './comment';
import * as actionTypes from '../actions/actionTypes';

const stubComments = [
    { id: 1, article_id: 1, author_id: 0, content: '1' },
    { id: 3, article_id: 3, author_id: 1, content: '3' },
    { id: 2, article_id: 2, author_id: 0, content: '2' },
];

const stubNewComment = {
    id: 4,
    article_id: 0,
    author_id: 0,
    content: '4',
};

describe('Comment Reducer', () => {
    it('should return default state', () => {
        const newState = reducer(undefined, {}); // initialize
        expect(newState).toEqual({ comments: null, selectedComment: null, lastCommentID: null });
    });

    it('should post comment', () => {
        const stubInitialState = {
            comments: stubComments,
            selectedComment: null,
            lastCommentID: 0,
        };
        const newState = reducer(stubInitialState, {
            type: actionTypes.POST_COMMENT,
            id: stubNewComment.id,
            article_id: stubNewComment.article_id,
            author_id: stubNewComment.author_id,
            content: stubNewComment.content,
        });
        expect(newState).toEqual({
            comments: [...stubComments, stubNewComment],
            selectedComment: null,
            lastCommentID: 4,
        });
    });

    it('should delete comment', () => {
        const stubInitialState = {
            comments: [ stubNewComment, ...stubComments],
            selectedComment: null,
            lastCommentID: 4,
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.DELETE_COMMENT,
            id: 4,
        });
        expect(newState).toEqual({
            comments: stubComments,
            selectedComment: null,
            lastCommentID: 3,
        });
        newState = reducer(newState, {
            type: actionTypes.DELETE_COMMENT,
            id: 1,
        });
        expect(newState).toEqual({
            comments: [stubComments[1], stubComments[2]],
            selectedComment: null,
            lastCommentID: 3,
        });
        newState = reducer(newState, {
            type: actionTypes.DELETE_COMMENT,
            id: 3,
        });
        expect(newState).toEqual({
            comments: [stubComments[2]],
            selectedComment: null,
            lastCommentID: 2,
        });
        newState = reducer(newState, {
            type: actionTypes.DELETE_COMMENT,
            id: 2,
        });
        expect(newState).toEqual({
            comments: [],
            selectedComment: null,
            lastCommentID: -1,
        });
    });

    it('should edit comment', () => {
        const modifiedComment = { ...stubComments[0], content: "new content" };
        const stubInitialState = {
            comments: [stubNewComment, stubComments[0]],
            selectedComment: null,
            lastCommentID: 4,
        };
        let newState = reducer(stubInitialState, {
            type: actionTypes.EDIT_COMMENT,
            id: modifiedComment.id,
            article_id: modifiedComment.article_id,
            author_id: modifiedComment.author_id,
            content: modifiedComment.content,
        });
        expect(newState).toEqual({
            comments: [stubNewComment, modifiedComment],
            selectedComment: null,
            lastCommentID: 4,
        });
    });

    it('should get comment', () => {
        const stubSelectedComment = stubNewComment;
        const newState = reducer(undefined, {
            type: actionTypes.GET_COMMENT,
            comment: stubSelectedComment,
        });
        expect(newState).toEqual({
            comments: null,
            selectedComment: stubSelectedComment,
            lastCommentID: null,
        });
    });

    it('should get all comments', () => {
        let newState = reducer(undefined, {
            type: actionTypes.GET_COMMENTS,
            comments: stubComments,
        });
        expect(newState).toEqual({
            comments: stubComments,
            selectedComment: null,
            lastCommentID: 3,
        });
        newState = reducer(undefined, {
            type: actionTypes.GET_COMMENTS,
            comments: [],
        });
        expect(newState).toEqual({
            comments: [],
            selectedComment: null,
            lastCommentID: -1,
        });
    });
});
