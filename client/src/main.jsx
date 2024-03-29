import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserStore from './store/UserStore.js'
import TaskStore from './store/TaskStore.js'

export const Context = createContext(null)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Context.Provider value={{
    user: new UserStore(),
    task: new TaskStore(),
  }}>
    <App />
  </Context.Provider>
)
