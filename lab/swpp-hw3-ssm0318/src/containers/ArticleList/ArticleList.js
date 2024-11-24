import React, { Component } from 'react';

import Article from '../../components/Article/Article';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { ListGroup, Button, Container } from 'react-bootstrap';

class ArticleList extends Component {
  clickArticleHandler = (ac) => {
    this.props.history.push('/articles/' + ac.id);
  }

  clickCreateHandler = (ac) => {
    this.props.history.push('/articles/create');
  }

  render() {
    const articles = this.props.articles
      .sort((a, b) => { return a.id > b.id ? -1 : 1; })
      .map((ac) => {
        return (
          <Article
            key={ac.id}
            id={ac.id}
            title={ac.title}
            author_id={ac.author_id}
            clickDetail={() => this.clickArticleHandler(ac)}
          />
        );
    });

    return (
      <Container>
        <div className="ArticleList">
          <div>
            <Button variant="primary" id="create-article-button" onClick={() => this.clickCreateHandler()}>New Article</Button>
          </div>
          <br />
          <div className='articles'>
            <ListGroup>
              {articles}
            </ListGroup>
          </div>
          <br />
        </div>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    articles: state.atc.articles,
  };
};

export default connect(mapStateToProps, null)(withRouter(ArticleList));