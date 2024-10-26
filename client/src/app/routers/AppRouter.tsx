import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAppDispatch, useTypedSelector } from '../../features/hooks'
import { useEffect, useMemo, useState } from 'react'
import { setAuthLoading, setAuthTrue } from '../../entities/users'
import { check, getUser } from '../../shared/api'

export const AppRouter = () => {
    const { user, isAuth, authLoading } = useTypedSelector((state) => state.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setAuthLoading(true))
        check().then((data) => {
            // dispatch(setAuthTrue(data))
            fetchUser(data.id)
        }).finally(() => dispatch(setAuthLoading(false)))
    }, [])

    const fetchUser = async (id) => {
        try {
            if (id) {
                const data = await getUser(id)
                dispatch(setAuthTrue(data))
            }
        } catch (e) {
            alert(`Ошибка при получении информации о пользователе: ${e.response.data.message}`)
        }
    }

    const currentRouter = useMemo(() => router(user, isAuth, authLoading), [user, isAuth, authLoading])

    if(authLoading) {
        return <h1>Загрузка...</h1>
    }

    return (
        <RouterProvider router={currentRouter}></RouterProvider >
    )
}