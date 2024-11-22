import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import * as actionCreators from "../../store/actions/index";

class CommentCreate extends Component {
  state = {
    content: '',
  }

  postCommentHandler = () => {
    this.props.onPostComment(this.props.lastCommentID + 1, this.props.article_id, this.props.loggedInUser.id, this.state.content);
    this.setState({ content: '' });
  }

  render() {
    return (
      <div className="comment-create">
        <Container>
            <Row className="justify-content-md-center">
                <Col md={{ span: 6 }}>
                    <Form className="Comment">
                        <Form.Group controlId="new-comment-content-input">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as="textarea" value={this.state.content} placeholder="Write comment" rows="2" onChange={(e) => this.setState({ content: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
        <span>  {'   '}  </span>
        <Button 
          id="confirm-create-comment-button" 
          disabled={this.state.content === '' ? true : false}
          onClick={() => this.postCommentHandler()}>
          Confirm
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.usr.loggedInUser,
    lastCommentID: state.cm.lastCommentID,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPostComment: (id, article_id, author_id, content) => dispatch(
      actionCreators.postComment({id: id, article_id: article_id, author_id: author_id, content: content})),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommentCreate));