import React, { Component } from 'react';

import { connect } from 'react-redux';

class UserName extends Component {
    render() {
        const author = this.props.users.filter((user) => {
            return user.id === this.props.author_id;
        });
        const author_name = author[0].name;

        return (
            <span className="author-name">{author_name}</span>
        );
    }
}


const mapStateToProps = state => {
    return {
        users: state.usr.users,
    };
};

export default connect(mapStateToProps, null)(UserName);