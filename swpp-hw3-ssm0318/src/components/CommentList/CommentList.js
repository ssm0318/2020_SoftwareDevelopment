import React, { Component } from 'react';

import Comment from '../../containers/Comment/Comment';

import { ListGroup, Container, Row } from 'react-bootstrap';

class CommentList extends Component {
  render() {
    const comments = this.props.comments.map((c) => {
      return (
        <Comment
          key={c.id}
          id={c.id}
          author_id={c.author_id}
          content={c.content}
        />
      );
    });
 
    return (
      <Container>
        <Row className="justify-content-md-center">
          <ListGroup>
            {comments}
          </ListGroup>
        </Row>
        <br />
      </Container>
    )
  }
}

export default CommentList;