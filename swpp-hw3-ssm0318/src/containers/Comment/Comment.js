import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { ListGroup } from 'react-bootstrap';

import UserName from '../UserName/UserName';
import UserCommentButton from '../UserCommentButton/UserCommentButton';

class Comment extends Component {
    render() {
        return (
            <div className="comment">
                <ListGroup horizontal>
                    <ListGroup.Item><span style={{fontWeight: 'bold'}}><UserName author_id={this.props.author_id} /></span></ListGroup.Item>
                    <ListGroup.Item>{this.props.content}</ListGroup.Item>
                    {this.props.loggedInUser.id === this.props.author_id ? 
                        <UserCommentButton id={this.props.id} />  : 
                        <span></span>}
                </ListGroup>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        loggedInUser: state.usr.loggedInUser,
    };
};

export default connect(mapStateToProps, null)(withRouter(Comment));