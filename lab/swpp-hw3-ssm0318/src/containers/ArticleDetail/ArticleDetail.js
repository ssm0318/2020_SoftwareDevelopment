import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import * as actionCreators from '../../store/actions/index';

import UserName from '../UserName/UserName';
import CommentList from '../../components/CommentList/CommentList';
import CommentCreate from '../CommentCreate/CommentCreate';

import { Container, Row, ListGroup, Button } from 'react-bootstrap';

class ArticleDetail extends Component {
    componentDidMount() {
        this.props.onGetArticle(parseInt(this.props.match.params.id));
    }

    deleteArticleHandler = () => {
        this.props.onDeleteArticle(this.props.selectedArticle.id);
    }

    clickBackHandler = () => {
        this.props.history.push('/articles');
    }

    clickEditHandler = () => {
        this.props.history.push(`/articles/${this.props.selectedArticle.id}/edit`);
    }

    render() {
        if (this.props.selectedArticle == null) {
            return <span></span>
        }

        const articleComments = () => {
            return this.props.comments.filter((c) => {
                return c.article_id === this.props.selectedArticle.id;
            }).sort((a, b) => { return a.id > b.id ? -1 : 1; });
        };

        return (
            <Container className="article-detail">
                <Row className="justify-content-md-center">
                    <div>
                        <Button id="back-detail-article-button" onClick={() => this.clickBackHandler()}>Home</Button>{'   '}
                        {this.props.selectedArticle.author_id === this.props.loggedInUser.id ? 
                            (<span>
                                <Button id="edit-article-button" onClick={() => this.clickEditHandler()}>Edit</Button>{'   '}
                                <Button id="delete-article-button" onClick={() => this.deleteArticleHandler()}>Delete</Button>{'   '}
                            </span>) :
                            <span></span>}
                    </div>
                </Row>
                <br />
                <Row className="justify-content-md-center">
                    <ListGroup>
                        <ListGroup.Item as="h2" id="article-title">{this.props.selectedArticle.title}</ListGroup.Item>
                        <ListGroup.Item as="p" id="article-author"><span style={{fontWeight: 'bold'}}>Author:</span> <UserName author_id={this.props.selectedArticle.author_id} /></ListGroup.Item>
                        <ListGroup.Item as="p" id="article-content">{this.props.selectedArticle.content}</ListGroup.Item>
                    </ListGroup>
                </Row>
                <br />
                <div>
                    <CommentCreate article_id={this.props.selectedArticle.id}/>
                </div>
                <br />
                <br />
                <Row className="justify-content-md-center">
                    <CommentList comments={articleComments()} />
                </Row>
            </Container>
        );
    }
};

const mapStateToProps = state => {
    return {
        selectedArticle: state.atc.selectedArticle,
        loggedInUser: state.usr.loggedInUser,
        comments: state.cm.comments,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetArticle: id => dispatch(actionCreators.getArticle(id)),
        onDeleteArticle: id => dispatch(actionCreators.deleteArticle(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArticleDetail));