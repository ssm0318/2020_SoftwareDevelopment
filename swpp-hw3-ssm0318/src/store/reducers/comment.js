import * as actionTypes from '../actions/actionTypes';

const initialState = {
    comments: JSON.parse(localStorage.getItem("comments")),
    selectedComment: JSON.parse(localStorage.getItem("selectedComment")),
    lastCommentID: JSON.parse(localStorage.getItem("lastCommentID")),
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_COMMENTS:
            const max_id = (action.comments.length > 0) ? (action.comments.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id : -1;
            localStorage.setItem("comments", JSON.stringify( action.comments ));
            localStorage.setItem("lastCommentID", max_id );
            return { ...state, comments: action.comments, lastCommentID: max_id };
        case actionTypes.GET_COMMENT:
            localStorage.setItem("selectedComment", JSON.stringify( action.comment ));
            return { ...state, selectedComment: action.comment };
        case actionTypes.POST_COMMENT:
            const newComment = {
                id: action.id, article_id: action.article_id, author_id: action.author_id, content: action.content
            }
            localStorage.setItem("comments", JSON.stringify( state.comments.concat(newComment) ));
            localStorage.setItem("lastCommentID", action.id );
            return {...state, comments: [...state.comments, newComment], lastCommentID: action.id};
        case actionTypes.EDIT_COMMENT:
            const updatedComments = state.comments.map((comment) => {
                if (comment.id === action.id) {
                    return { ...comment, content: action.content };
                } else {
                    return { ...comment };
                }
            });
            localStorage.setItem("comments", JSON.stringify( updatedComments ));
            return {...state, comments: updatedComments};
        case actionTypes.DELETE_COMMENT:
            const deletedComments = state.comments.filter((comment) => {
                return comment.id !== action.id
            });
            const newMax_id = (deletedComments.length > 0) ? (deletedComments.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id : -1;
            localStorage.setItem("comments", JSON.stringify( deletedComments ));
            localStorage.setItem("lastCommentID", newMax_id );
            return { ...state, comments: deletedComments, lastCommentID: newMax_id };
        default:
            break;
    }
    return state;
};

export default reducer;