import { combineReducers } from 'redux';

export const types = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  SEARCH: 'SEARCH',
}

export const actionCreators = {
  add: (item) => {
    return {type: types.ADD, payload: item}
  },
  remove: (index) => {
    return {type: types.REMOVE, payload: index}
  },
  search: (filter) => {
    return {type: types.SEARCH, payload: filter}
  }
}

const initialState = {
  todos: ['Click to remove', 'Learn React Native', 'Write Code', 'Ship App'],
  sort: 0,
  radius_filter: 1,// The max value is 40000 meters (25 miles). 1 mile = 1609.34 meters
  offer_deals: false,
  search_click: false,
  filter_data: {
    offer_deals: [{'text': 'Offering a Deal', 'select': false}],
    distance: [[
      {'text': '1 mile', 'value': 1, 'select': true}, 
      {'text': '5 miles', 'value': 5, 'select': false}, 
      {'text': '10 miles', 'value': 10, 'select': false}, 
      {'text': '15 miles', 'value': 15, 'select': false}, 
      {'text': '20 miles', 'value': 20, 'select': false}, 
      {'text': '25 miles', 'value': 25, 'select': false}, 
    ]],
    sort_by: [[
      {'text': 'Best matched', 'value': 0, 'select': true}, 
      {'text': 'Distance', 'value': 1, 'select': false}, 
      {'text': 'Highest Rated', 'value': 2, 'select': false}, 
    ]]            
  }
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
    case types.SEARCH: {
      console.log('reducer =>>> SEARCH' + action.filter)
      return {...state, filter_data: [11,2123]}
    }
  }

  return state
}

export const appReducer = combineReducers({
  reducer
});