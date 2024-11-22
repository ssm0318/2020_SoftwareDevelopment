import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Button, ListGroup } from 'react-bootstrap';

import * as actionCreators from "../../store/actions/index";

class UserCommentButton extends Component {
    componentDidMount() {
        this.props.onGetComment(this.props.id);
    }

    editCommentHandler = () => {
        let text = window.prompt("Edit Comment", this.props.selectedComment.content);
        if (text !== '' && text != null) {
            this.props.onEditComment(this.props.selectedComment.id, this.props.selectedComment.article_id, this.props.selectedComment.author_id, text);
        }
    }

    deleteCommentHandler = () => {
        this.props.onDeleteComment(this.props.selectedComment);
    }

    render() {
        if (this.props.selectedComment == null) {
            return <span></span>
        }
        return (
            <ListGroup horizontal>
                <ListGroup.Item>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        id="edit-comment-button"
                        onClick={() => this.editCommentHandler()}>
                        Edit
                    </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        id="delete-comment-button"
                        onClick={() => this.deleteCommentHandler()}>
                        Delete
                    </Button>
                </ListGroup.Item>
            </ListGroup>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedComment: state.cm.selectedComment,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onEditComment: (id, article_id, author_id, content) => dispatch(
            actionCreators.editComment({ id: id, article_id: article_id, author_id: author_id, content: content })),
        onGetComment: (id) => dispatch(actionCreators.getComment(id)),
        onDeleteComment: (comment) => dispatch(actionCreators.deleteComment(comment)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserCommentButton));