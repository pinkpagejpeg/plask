import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAppDispatch, useTypedSelector } from '@redux'
import { useEffect, useMemo } from 'react'
import { fetchUserById } from '../../entities/users'
import { check } from '../../shared/api'

export const AppRouter = () => {
    const { user, isAuth, loading, error } = useTypedSelector((state) => state.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        check().then((data) => {
            dispatch(fetchUserById(data.id))
        })
    }, [dispatch])

    const currentRouter = useMemo(() => router(user, isAuth, loading), [user, isAuth, loading])

    if (loading) {
        return <h3>Загрузка...</h3>
    }

    if (error) {
        return <h3>{error}</h3>
    }

    return (
        <RouterProvider router={currentRouter}></RouterProvider >
    )
}