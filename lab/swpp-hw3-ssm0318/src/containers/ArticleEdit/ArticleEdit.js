import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actionCreators from '../../store/actions/index';

import ArticleWrite from '../../containers/ArticleWrite/ArticleWrite';

class ArticleEdit extends Component {
    componentDidMount() {
        this.props.onGetArticle(parseInt(this.props.match.params.id));
    }

    render() {
        if (this.props.selectedArticle == null) {
            return <span className="loading">Article Not Found</span>
        }

        let redirect = null;
        if (this.props.loggedInUser.id !== this.props.selectedArticle.author_id) {
          redirect = <Redirect to='/' />
        }

        return ( 
            <div className="article-edit">
                {redirect}
                <ArticleWrite id={this.props.selectedArticle.id} title={this.props.selectedArticle.title} content={this.props.selectedArticle.content} editing={true}/>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        loggedInUser: state.usr.loggedInUser,
        selectedArticle: state.atc.selectedArticle,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetArticle: id => dispatch(actionCreators.getArticle(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleEdit);