import React, { useContext, useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/appRouter/AppRouter'
import './styles/App.scss'
import { observer } from 'mobx-react-lite'
import { Context } from './main'
import { check, getUser } from './http/userApi'

const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then((data) => {
      user.setUser(data)
      user.setIsAuth(true)
      fetchUser()
    }).finally(() => setLoading(false))
  }, [])

  const fetchUser = async () => {
    try {
        if (user._user.id) {
            const data = await getUser(user._user.id)
            user.setUser(data)
        }
    } catch (e) {
        alert('Ошибка при получении информации о пользователе:', e.response.data.message)
    }
};

  return (
    <div className='App'>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  )
})

export default App
