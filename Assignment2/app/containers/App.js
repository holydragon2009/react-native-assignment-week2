import React, { Component } from 'react'
import { AppRegistry, View } from 'react-native'
import { connect } from 'react-redux'

import { actionCreators } from '../redux/abcRedux'

import MyNavigation from '../component/MyNavigation'

const mapStateToProps = (state) => ({
  todos: state.todos,
})

class App extends Component {

  onAddTodo = (text) => {
    const {dispatch} = this.props

    dispatch(actionCreators.add(text))
  }

  onRemoveTodo = (index) => {
    const {dispatch} = this.props

    dispatch(actionCreators.remove(index))
  }

  render() {
    const {todos} = this.props

    return (
        <MyNavigation />
    )
  }
}

export default connect(mapStateToProps)(App)
