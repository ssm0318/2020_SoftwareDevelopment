import React, { Component } from 'react';
import axios from 'axios';

import Todo from '../../components/Todo/Todo';
import TodoDetail from '../../components/TodoDetail/TodoDetail';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter} from 'react-router';

// import * as actionTypes from '../../store/actions/actionTypes';
import * as actionCreators from '../../store/actions/index';

import './TodoList.css';

class TodoList extends Component {
  componentDidMount() {
    this.props.onGetAll();
  }
  // clickTodoHandler = (td) => {
  //   if (this.props.selectedTodo === td) {
  //     this.setState({ ...this.state, selectedTodo: null });
  //   } else {
  //     this.setState({ ...this.state, selectedTodo: td });
  //   }
  // }
  clickTodoHandler = (td) => {
    this.props.history.push('/todos/' + td.id);
  }

  render() {
    // const todos = this.state.todos.map(td => {
    const todos = this.props.storedTodos.map((td) => {
      return (
        <Todo
          key={td.id}
          title={td.title}
          done={td.done}
          clickDetail={() => this.clickTodoHandler(td)}
          clickDone={() => this.props.onToggleTodo(td.id)}
          clickDelete={() => this.props.onDeleteTodo(td.id)}
          clicked={() => this.clickTodoHandler(td)}
        />
      );
    });

    // let todo = null;
    // if (this.props.selectedTodo) {
    //   todo = <TodoDetail
    //     title={this.props.selectedTodo.title}
    //     content={this.props.selectedTodo.content}
    //   />
    // }

    return (
      <div className="TodoList">
        <div className='title'>
          {this.props.title}
        </div>
        <div className='todos'>
          {todos}
        </div>
        {/* { todo } */}
        <NavLink to='/new-todo' exact>New Todo</NavLink>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    storedTodos: state.td.todos,
    selectedTodo: state.td.selectedTodo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetAll: () => dispatch(actionCreators.getTodos()),
    onDeleteTodo: (id) => dispatch(actionCreators.deleteTodo(id)),
    onToggleTodo: (id) => dispatch(actionCreators.toggleTodo(id)),
  };
};

// 여기서의 state는 component state가 아닌 global state
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TodoList));