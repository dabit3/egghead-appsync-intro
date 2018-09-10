import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const query = gql`
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
    console.log('props: ', this.props)
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

export default graphql(query, {
  options: {
    fetchPolicy: 'cache-and-network'
  },
  props: props => ({
    todos: props.data.listTodos ? props.data.listTodos.items : []
  })
})(App)
