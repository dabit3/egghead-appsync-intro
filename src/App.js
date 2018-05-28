import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import uuidV4 from 'uuid/v4'

const mutation = gql`
  mutation createTodo($name: String!, $completed: Boolean!) {
    createTodo(input: {
      name: $name
      completed: $completed
    }) {
      name
      completed
      id
    }
  }
`

const query = gql`
  query listTodos {
    listTodos {
      items {
        id
        name
        completed
      }
    }
  }
`

class App extends Component {
  state = {
    todo: ''
  }
  addTodo = () => {
    if (this.state.todo === '') return
    const todo = {
      name: this.state.todo,
      completed: false,
      id: uuidV4()
    }
    this.props.addTodo(todo)
    this.setState({ todo: '' })
  }
  render() {
    console.log('props: ', this.props)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <input
          value={this.state.todo}
          onChange={e => this.setState({ todo: e.target.value })}
        />
        <button onClick={this.addTodo}>
          Add Todo
        </button>
        {
          this.props.todos.map((todo, index) => (
            <p key={index}>{todo.name}</p>
          ))
        }
      </div> 
    );
  }
}

export default compose(
  graphql(query, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: props => ({
      todos: props.data.listTodos ? props.data.listTodos.items : []
    })
  }),
  graphql(mutation, {
    props: props => ({
      addTodo: todo => {
        props.mutate({
          variables: todo,
          optimisticResponse: {
            __typename: 'Mutation',
            createTodo: { ...todo,  __typename: 'Todo' }
          },
          update: (proxy, { data: { createTodo } }) => {
            const data = proxy.readQuery({ query: query });
            console.log('New data: ', data)
            data.listTodos.items.unshift(createTodo);
            proxy.writeQuery({ query: query, data });
          }
        })
      }
    })
  })
)(App)
