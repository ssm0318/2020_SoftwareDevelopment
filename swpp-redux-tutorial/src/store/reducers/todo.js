import * as actionTypes from '../actions/actionTypes';

const initialState = {
    todos: [
        { id: 1, title: 'SWPP', content: 'take swpp class', done: true },
        { id: 2, title: 'Movie', content: 'watch movie', done: false },
        { id: 3, title: 'Dinner', content: 'eat dinner', done: false }
    ],
    selectedTodo: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TODO:
            // create a new object
            const newTodo = {
                id: action.id, //temporary
                title: action.title, content: action.content, done: action.done
            }
            // create new array, don't push directly to state
            // return {...state, todos: state.todos.concat(newTodo)};
            return {...state, todos: [...state.todos, newTodo]};
        case actionTypes.DELETE_TODO:
            const deleted = state.todos.filter((todo) => {
                return todo.id !== action.targetID;
            });
            return { ...state, todos: deleted };
        case actionTypes.TOGGLE_DONE:
            const modified = state.todos.map((todo) => {
                if (todo.id === action.targetID) {
                    return { ...todo, done: !todo.done };
                } else {
                    return { ...todo };
                }
            });
            return { ...state, todos: modified };
        case actionTypes.GET_TODO:
            // const selectedTodo = state.todos.find(td => td.id === parseInt(action.targetID));
            // const selectedTodo = state.todos.find(td => td.id === action.targetID);
            // const target = { ...state.todos[action.targetID - 1]}; // temporary
            // return { ...state, selectedTodo };
            return { ...state, selectedTodo: action.target };
        case actionTypes.GET_ALL:
            return { ...state, todos: action.todos };
        default:
            break;
    }
    return state;
};

export default reducer;