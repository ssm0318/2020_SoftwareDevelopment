import * as actionTypes from '../actions/actionTypes';

import axios from 'axios';
import { push } from 'connected-react-router';

export const getComments_ = (comments) => {
    console.log("get comments called");
    return {
        type: actionTypes.GET_COMMENTS,
        comments: comments
    }
};

export const getComments = () => {
    return (dispatch) => {
        return axios.get('/api/comments')
            .then(res => dispatch(getComments_(res.data)));
    };
}

export const getComment_ = (comment) => {
    console.log("get comment called");
    return {
        type: actionTypes.GET_COMMENT,
        comment: comment
    }
};

export const getComment = (id) => {
    return (dispatch) => {
        return axios.get(`/api/comments/${id}`)
            .then(res => dispatch(getComment_(res.data)));
    };
}

export const postComment_ = (comment) => {
    console.log("post comment called");
    return {
        type: actionTypes.POST_COMMENT,
        id: comment.id,
        article_id: comment.article_id,
        author_id: comment.author_id,
        content: comment.content,
    }
};

export const postComment = (ac) => {
    return (dispatch) => {
        return axios.post(`/api/comments`, ac)
            .then(res => dispatch(postComment_(res.data)))
            .then((ac) => dispatch(push(`/articles/${ac.article_id}`)));
    };
}

export const editComment_ = (comment) => {
    console.log("edit comment called");
    return {
        type: actionTypes.EDIT_COMMENT,
        id: comment.id,
        article_id: comment.article_id,
        author_id: comment.author_id,
        content: comment.content
    }
};

export const editComment = (ac) => {
    return (dispatch) => {
        return axios.put(`/api/comments/${ac.id}`, ac)
            .then(res => dispatch(editComment_(res.data)))
            .then((ac) => dispatch(push(`/articles/${ac.article_id}`)));
    };
}

export const deleteComment_ = (id) => {
    console.log("delete comment called");
    return {
        type: actionTypes.DELETE_COMMENT,
        id: id,
    };
};

export const deleteComment = (c) => {
    return (dispatch) => {
        return axios.delete(`/api/comments/${c.id}`)
            .then(res => dispatch(deleteComment_(parseInt(c.id))))
            .then(() => dispatch(push(`/articles/${c.article_id}`)));
    };
};