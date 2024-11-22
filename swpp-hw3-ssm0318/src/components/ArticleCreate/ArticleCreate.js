import React, { Component } from 'react';

import ArticleWrite from '../../containers/ArticleWrite/ArticleWrite';

const ArticleCreate = (props) => {
  return (
    <div className="article-create">
      <ArticleWrite id={props.lastArticleID + 1} title={''} content={''} editing={false}/>
    </div>
  );
};

export default ArticleCreate;
