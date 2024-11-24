import React from 'react';

import { ListGroup, Button } from 'react-bootstrap';

import UserName from '../../containers/UserName/UserName';

const Article = (props) => {
  return (
    <div className="article">
      <ListGroup.Item>
        {props.id} <UserName author_id={props.author_id}/>
        <br />
        <Button variant="outline-primary" onClick={props.clickDetail}>{props.title}</Button>
      </ListGroup.Item>
    </div>
  );
};

export default Article;