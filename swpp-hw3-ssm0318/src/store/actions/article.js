import * as actionTypes from '../actions/actionTypes';

import axios from 'axios';
import { push } from 'connected-react-router';

export const getArticles_ = (articles) => {
    console.log("get articles called");
    return {
        type: actionTypes.GET_ARTICLES,
        articles: articles
    }
};

export const getArticles = () => {
    return (dispatch) => {
        return axios.get('/api/articles')
            .then(res => dispatch(getArticles_(res.data)));
    };
}

export const getArticle_ = (article) => {
    console.log("get article called");
    return {
        type: actionTypes.GET_ARTICLE,
        article: article
    }
};

export const getArticle = (id) => {
    return (dispatch) => {
        return axios.get(`/api/articles/${id}`)
            .then(res => dispatch(getArticle_(res.data)));
    };
}

export const postArticle_ = (article) => {
    console.log("post article called");
    return {
        type: actionTypes.POST_ARTICLE,
        id: article.id,
        author_id: article.author_id,
        title: article.title,
        content: article.content
    }
};

export const postArticle = (ac) => {
    return (dispatch) => {
        return axios.post(`/api/articles`, ac)
            .then(res => dispatch(postArticle_(res.data)))
            .then((ac) => dispatch(push(`/articles/${ac.id}`)));
    };
}

export const editArticle_ = (article) => {
    console.log("edit article called");
    return {
        type: actionTypes.EDIT_ARTICLE,
        id: article.id,
        author_id: article.author_id,
        title: article.title,
        content: article.content
    }
};

export const editArticle = (ac) => {
    return (dispatch) => {
        return axios.put(`/api/articles/${ac.id}`, ac)
            .then(res => dispatch(editArticle_(res.data)))
            .then((ac) => dispatch(push(`/articles/${ac.id}`)));
    };
}

export const deleteArticle_ = (id) => {
    console.log("delete article called");
    return {
        type: actionTypes.DELETE_ARTICLE,
        id: id,
    };
};

export const deleteArticle = (id) => {
    return (dispatch) => {
        return axios.delete(`/api/articles/${id}`)
            .then(res => dispatch(deleteArticle_(parseInt(id))))
            .then(() => dispatch(push('/articles')));
    };
};