import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { buildSubscription } from 'aws-appsync'
import { graphqlMutation } from 'aws-appsync-react'

import uuidV4 from 'uuid/v4'

const CreateTodo = gql`
  mutation createTodo($title: String!, $completed: Boolean) {
    createTodo(input: {
      title: $title
      completed: $completed
    }) {
      title
      completed
      id
    }
  }
`

const ListTodos = gql`
  query listTodos {
    listTodos {
      items {
        id
        title
        completed
      }
    }
  }
`

const SubscribeToTodos = gql`
  subscription onCreateTodo {
    onCreateTodo {
      id
      title
      completed
    }
  }
`

class App extends Component {
  state = {
    todo: ''
  }
  componentDidMount() {
    this.props.data.subscribeToMore(
      buildSubscription(SubscribeToTodos, ListTodos)
    )
  }
  addTodo = () => {
    if (this.state.todo === '') return
    const todo = {
      title: this.state.todo,
      completed: false
    }
    this.props.createTodo(todo)
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
            <p key={index}>{todo.title}</p>
          ))
        }
      </div> 
    )
  }
}

export default compose(
  graphql(ListTodos, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: props => ({
      todos: props.data.listTodos ? props.data.listTodos.items : [],
      data: props.data
    })
  }),
  graphqlMutation(CreateTodo, ListTodos, 'Todo'),
)(App)
