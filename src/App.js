import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

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

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {
          this.props.todos.map((todo, index) => (
            <p>{todo.title}</p>
          ))
        }
      </div> 
    );
  }
}

export default graphql(ListTodos, {
  options: {
    fetchPolicy: 'cache-and-network'
  },
  props: props => ({
    todos: props.data.listTodos ? props.data.listTodos.items : []
  })
})(App)
