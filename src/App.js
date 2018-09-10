import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { graphqlMutation } from 'aws-appsync-react'

const createTodo = gql`
  mutation createTodo($title: String!, $completed: Boolean!) {
    createTodo(input: {
      title: $name
      completed: $completed
    }) {
      id title completed
    }
  }
`

class App extends Component {
  state = { todo: '' }
  addTodo = () => {
    if (this.state.todo === '') return
    const todo = {
      title: this.state.todo,
      completed: false
    }
    this.props.addTodo(todo)
    this.setState({ todo: '' })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <input
          onChange={e => this.setState({ todo: e.target.value })}
          value={this.state.todo}
        />
        <button onClick={this.addTodo}>
          Add Todo
        </button>
      </div> 
    );
  }
}

export default compose(
  graphqlMutation(CreatePost, query, 'Todo'),
  graphql(createTodo, {
    props: props => ({
     graphqlMutation(CreatePost, listPosts, 'Post') addTodo: todo => {
        props.mutate({ variables: todo })
      }
    })
  })
)(App)