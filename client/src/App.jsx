import React, { useContext, useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/appRouter/AppRouter'
import './styles/App.scss'
import { observer } from 'mobx-react-lite'
import { Context } from './main'
import { check } from './http/userApi'

const App = observer(() => {
  const { user, task } = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then((data) => {
      user.setUser(data)
      user.setIsAuth(true)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className='App'>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  )
})

export default App
