export const types = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
}

export const actionCreators = {
  add: (item) => {
    return {type: types.ADD, payload: item}
  },
  remove: (index) => {
    return {type: types.REMOVE, payload: index}
  }
}
const initialState = {
  todos: ['Click to remove', 'Learn React Native', 'Write Code', 'Ship App'],
  deals_filter: false,
  radius_filter: 1,// The max value is 40000 meters (25 miles). 1 mile = 1609.34 meters
  sort: 0  
}

export const reducer = (state = initialState, action) => {
  const {todos} = state
  const {type, payload} = action

  switch (type) {
    case types.ADD: {
      return {
        ...state,
        todos: [payload, ...todos],
      }
    }
    case types.REMOVE: {
      return {
        ...state,
        todos: todos.filter((todo, i) => i !== payload),
      }
    }
  }

  return state
}
