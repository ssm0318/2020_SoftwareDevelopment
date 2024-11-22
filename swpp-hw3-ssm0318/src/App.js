import React, { Component } from 'react';
import './App.css';

import Header from './containers/Header/Header';
import Login from './containers/Login/Login';
import ArticleList from './containers/ArticleList/ArticleList';
import ArticleCreate from './containers/ArticleWrite/ArticleWrite';
import ArticleDetail from './containers/ArticleDetail/ArticleDetail';
import ArticleEdit from './containers/ArticleEdit/ArticleEdit';

import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import * as actionCreators from './store/actions/index';

class App extends Component {
  componentDidMount() {
    if (this.props.users == null || this.props.articles == null || this.props.comments == null) {
      this.props.getUsers();
      this.props.getArticles();
      this.props.getComments();
    }
  }

  render() {
    if (this.props.users == null || this.props.articles == null || this.props.comments == null) {
      return <span>Loading...</span>
    };
    return (
      <ConnectedRouter history={this.props.history}>
        <div className="App">
          <Header />
          <br />
          {this.props.loggedInUser == null ? (
            <Switch>
              <Route path='/articles' exact component={ArticleList} />
              <Route path='/login' exact component={Login} />
              <Redirect exact from='/' to='articles' />
              <Redirect exact to='/' />
            </Switch>
          ) : (
            <Switch>
              <Route path='/articles' exact component={ArticleList} />
              <Redirect exact from='/login' to='articles' />
              <Route path='/articles/create' exact component={ArticleCreate} />
              <Route path='/articles/:id' exact component={ArticleDetail} />
              <Route path='/articles/:id/edit' exact component={ArticleEdit} />
              <Redirect exact from='/' to='articles' />
              <Route render={() => <h1>Not Found</h1>} />)
            </Switch>
          )}
        </div>
      </ConnectedRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.usr.users,
    articles: state.atc.articles,
    comments: state.cm.comments,
    loggedInUser: state.usr.loggedInUser,
    lastCommentID: state.cm.lastCommentID,
    lastArticleID: state.atc.lastArticleID,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getArticles: () => dispatch(actionCreators.getArticles()),
    getUsers: () => dispatch(actionCreators.getUsers()),
    getComments: () => dispatch(actionCreators.getComments()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);