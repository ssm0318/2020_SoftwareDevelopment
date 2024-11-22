import * as actionTypes from '../actions/actionTypes';

const initialState = {
    articles: JSON.parse(localStorage.getItem("articles")),
    selectedArticle: JSON.parse(localStorage.getItem("selectedArticle")),
    lastArticleID: JSON.parse(localStorage.getItem("lastArticleID")),
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ARTICLES:
            const max_id = (action.articles.length > 0) ? (action.articles.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id : -1;
            localStorage.setItem("articles", JSON.stringify( action.articles ));
            localStorage.setItem("lastArticleID", max_id );
            return { ...state, articles: action.articles, lastArticleID: max_id };
        case actionTypes.GET_ARTICLE:
            localStorage.setItem("selectedArticle", JSON.stringify( action.article ));
            return { ...state, selectedArticle: action.article };
        case actionTypes.POST_ARTICLE:
            const newArticle = {
                id: action.id, author_id: action.author_id, title: action.title, content: action.content
            }
            localStorage.setItem("articles", JSON.stringify( state.articles.concat(newArticle) ));
            localStorage.setItem("lastArticleID", action.id );
            return {...state, articles: [...state.articles, newArticle], lastArticleID: action.id};
        case actionTypes.EDIT_ARTICLE:
            const updatedArticles = state.articles.map((article) => {
                if (article.id === action.id) {
                    return { ...article, title: action.title, content: action.content };
                } else {
                    return { ...article };
                }
            });
            localStorage.setItem("articles", JSON.stringify( updatedArticles ));
            return {...state, articles: updatedArticles};
        case actionTypes.DELETE_ARTICLE:
            const deletedArticles = state.articles.filter((article) => {
                return article.id !== action.id
            });
            const newMax_id = (deletedArticles.length > 0) ? (deletedArticles.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id : -1;
            localStorage.setItem("articles", JSON.stringify( deletedArticles ));
            localStorage.setItem("lastArticleID", newMax_id );
            return { ...state, articles: deletedArticles, lastArticleID: newMax_id };
        default:
            break;
    }
    return state;
};

export default reducer;