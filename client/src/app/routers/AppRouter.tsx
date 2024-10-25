import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAppDispatch, useTypedSelector } from '../../features/hooks'
import { useEffect, useState } from 'react'
import { setAuthTrue } from '../../entities/users'
import { check, getUser } from '../../shared/api'

export const AppRouter = () => {
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
    console.log(user, isAuth)
    return (
        <RouterProvider router={router()}></RouterProvider >
    )
}