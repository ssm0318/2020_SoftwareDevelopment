import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Container, Row, Col, Form, ButtonGroup, Button, ListGroup } from 'react-bootstrap';

import UserName from '../UserName/UserName';

import * as actionCreators from "../../store/actions/index";

class ArticleWrite extends Component {
  state = {
    title: '',
    content: '',
    tab: "write",
  }

  componentDidMount() {
    if (this.props.editing) {
      this.setState({ title: this.props.title });
      this.setState({ content: this.props.content });
    }
  }

  handleChange = () => this.setState({ tab: this.state.tab });

  postArticleHandler = () => {
    this.props.onPostArticle(this.props.lastArticleID + 1, this.props.loggedInUser.id, this.state.title, this.state.content);
  }

  editArticleHandler = () => {
    this.props.onEditArticle(this.props.id, this.props.loggedInUser.id, this.state.title, this.state.content);
  }

  editBackHandler = () => {
    if (this.props.title !== this.state.title || this.props.content !== this.state.content) {
      let confirm = window.confirm("Are you sure? The change will be lost.");
      if (confirm === true) {
        this.props.history.push('/articles/' + this.props.id);
      }
    } else {
      this.props.history.push('/articles/' + this.props.id);
    }
  }

  createBackHandler = () => {
    this.props.history.push('/articles');
  }

  render() {
    return (
      <div>
        <div className="article-write">
          <div className="tab-buttons">
            <ButtonGroup className="mb-2" value={this.state.tab} toggle="true">
              <Button id="write-tab-button" value="write" onClick={(e) => this.setState({ tab: e.target.value })}>Write</Button>
              <Button id="preview-tab-button" value="preview" onClick={(e) => this.setState({ tab: e.target.value })}>Preview</Button>
            </ButtonGroup>
          </div>
          <div className="write-preview">
            <br />
            {this.state.tab === "preview" ? (
              <div className="preview">
                <Container>
                  <ListGroup>
                    <ListGroup.Item as="h2" id="article-title">{this.state.title}</ListGroup.Item>
                    <ListGroup.Item as="p" id="article-author"><span style={{ fontWeight: 'bold' }}>Author:</span> <UserName author_id={this.props.loggedInUser.id} /></ListGroup.Item>
                    <ListGroup.Item as="p" id="article-content">{this.state.content}</ListGroup.Item>
                  </ListGroup>
                </Container>
              </div>
            ) : (
                <div className="write">
                  <Container>
                    <Row className="justify-content-md-center">
                      <Col md={{ span: 6 }}>
                        <Form className="Login">
                          <Form.Group controlId="article-title-input">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={this.state.title} placeholder="Enter title" onChange={(e) => this.setState({ title: e.target.value })} />
                          </Form.Group>
                          <Form.Group controlId="article-content-input">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" value={this.state.content} placeholder="Enter content" rows="10" onChange={(e) => this.setState({ content: e.target.value })} />
                          </Form.Group>
                        </Form>
                      </Col>
                    </Row>
                  </Container>
                </div>
              )}
          </div>
          <div>
            <Button
              id={this.props.editing ? "back-edit-article-button" : "back-create-article-button"}
              onClick={this.props.editing ? () => this.editBackHandler() : () => this.createBackHandler()}>
              Back
            </Button>
            <span>  {'   '}  </span>
            <Button
              id={this.props.editing ? "confirm-edit-article-button" : "confirm-create-article-button"}
              disabled={(this.state.title === '' || this.state.content === '') ? true : false}
              onClick={this.props.editing ? () => this.editArticleHandler() : () => this.postArticleHandler()}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.usr.users,
    loggedInUser: state.usr.loggedInUser,
    lastArticleID: state.atc.lastArticleID,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPostArticle: (id, author_id, title, content) => dispatch(
      actionCreators.postArticle({ id: id, author_id: author_id, title: title, content: content })),
    onEditArticle: (id, author_id, title, content) => dispatch(
      actionCreators.editArticle({ id: id, author_id: author_id, title: title, content: content })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArticleWrite));