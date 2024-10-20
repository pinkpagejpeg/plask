import { useState, useEffect, FC } from 'react'
import { AppRouter } from './routers'
import './styles/App.scss'
import { check, getUser } from '../shared/api'
import { MainProvider } from './providers'
import { useAppDispatch, useTypedSelector } from '../features/hooks'
import { setAuthTrue } from '../entities/users'

const App: FC = () => {
  const { user, isAuth } = useTypedSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    check().then((data) => {
      dispatch(setAuthTrue(data))
      fetchUser()
    }).finally(() => setLoading(false))
  }, [])

  const fetchUser = async () => {
    try {
      if (user.id) {
        const data = await getUser(user.id)
        dispatch(setAuthTrue(data))
      }
    } catch (e) {
      alert(`Ошибка при получении информации о пользователе: ${e.response.data.message}`)
    }
  }

  return (
    <div className='App'>
      <MainProvider>
        <AppRouter />
      </MainProvider>
    </div>
  )
}

export default App